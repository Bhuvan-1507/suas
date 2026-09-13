import { DailyCandle, getNifty50Data } from '../data/niftyDataEngine';
import { BacktestResult, DrawdownPoint, EquityPoint, ExperimentParams, TradeRecord } from '../types/research';

export function runBacktest(params: ExperimentParams, dataset?: DailyCandle[]): BacktestResult {
  const candles = dataset || getNifty50Data();
  const trades: TradeRecord[] = [];
  
  const totalRoundTripFrictionPct = params.slippagePct * 2 + params.frictionCostPct;
  let activeTrade: {
    id: number;
    entryDate: string;
    entryIndex: number;
    entryPrice: number;
    triggerDropPct: number;
    sma200AtEntry: number;
    regime: 'BULL' | 'BEAR';
  } | null = null;

  let tradeIdCounter = 1;

  for (let i = 200; i < candles.length - 1; i++) {
    const current = candles[i];

    // If already in a trade, check exit criteria
    if (activeTrade) {
      const daysHeld = i - activeTrade.entryIndex;
      let shouldExit = false;
      let exitReason: TradeRecord['exitReason'] = 'TIME_EXPIRED';
      let exitPrice = current.close;

      if (params.exitType === 'target_stop' || params.exitType === 'hybrid') {
        const targetPrice = activeTrade.entryPrice * (1 + params.targetProfitPct / 100);
        const stopPrice = activeTrade.entryPrice * (1 - params.stopLossPct / 100);

        if (current.high >= targetPrice) {
          shouldExit = true;
          exitReason = 'TARGET_HIT';
          exitPrice = targetPrice;
        } else if (current.low <= stopPrice) {
          shouldExit = true;
          exitReason = 'STOP_LOSS_HIT';
          exitPrice = stopPrice;
        }
      }

      if (!shouldExit && daysHeld >= params.holdingDays) {
        shouldExit = true;
        exitReason = 'TIME_EXPIRED';
        exitPrice = current.close;
      }

      if (i === candles.length - 2 && !shouldExit) {
        shouldExit = true;
        exitReason = 'END_OF_DATA';
        exitPrice = current.close;
      }

      if (shouldExit) {
        const grossReturnPct = ((exitPrice - activeTrade.entryPrice) / activeTrade.entryPrice) * 100;
        const netReturnPct = grossReturnPct - totalRoundTripFrictionPct;

        trades.push({
          id: activeTrade.id,
          entryDate: activeTrade.entryDate,
          entryIndex: activeTrade.entryIndex,
          entryPrice: Math.round(activeTrade.entryPrice * 100) / 100,
          exitDate: current.date,
          exitIndex: i,
          exitPrice: Math.round(exitPrice * 100) / 100,
          exitReason,
          holdingPeriodDays: daysHeld,
          grossReturnPct: Math.round(grossReturnPct * 100) / 100,
          netReturnPct: Math.round(netReturnPct * 100) / 100,
          triggerDropPct: activeTrade.triggerDropPct,
          isWin: netReturnPct > 0,
          sma200AtEntry: activeTrade.sma200AtEntry,
          regime: activeTrade.regime
        });

        activeTrade = null;
      }
      continue;
    }

    // Check Trigger Condition on Current Day
    let isTriggered = false;

    if (params.fallType === 'single_day') {
      isTriggered = current.changePct <= params.fallThresholdPct;
    } else if (params.fallType === 'multi_day') {
      const window = params.multiDayWindow || 3;
      if (i >= window) {
        const prevWindowClose = candles[i - window].close;
        const multiDayChange = ((current.close - prevWindowClose) / prevWindowClose) * 100;
        isTriggered = multiDayChange <= params.fallThresholdPct;
      }
    } else if (params.fallType === 'rsi_oversold') {
      isTriggered = current.rsi14 <= (params.rsiThreshold || 30);
    } else if (params.fallType === 'volatility_shock') {
      isTriggered = current.changePct <= -2.5 && current.volatility20d >= 20;
    }

    // Check Trend Regime Filter
    if (isTriggered) {
      if (params.trendFilter === 'above_200_sma' && current.close < current.sma200) {
        isTriggered = false;
      } else if (params.trendFilter === 'below_200_sma' && current.close >= current.sma200) {
        isTriggered = false;
      }
    }

    // Check VIX/Vol Filter
    if (isTriggered && params.regimeFilterVix !== 'none') {
      if (params.regimeFilterVix === 'low_vix' && current.volatility20d > 20) {
        isTriggered = false;
      } else if (params.regimeFilterVix === 'high_vix' && current.volatility20d <= 20) {
        isTriggered = false;
      }
    }

    // If triggered, initiate trade
    if (isTriggered) {
      let entryPrice = current.close;
      let entryDate = current.date;
      let entryIndex = i;

      if (params.entryTiming === 'next_day_open' && i + 1 < candles.length) {
        entryPrice = candles[i + 1].open;
        entryDate = candles[i + 1].date;
        entryIndex = i + 1;
      }

      activeTrade = {
        id: tradeIdCounter++,
        entryDate,
        entryIndex,
        entryPrice,
        triggerDropPct: current.changePct,
        sma200AtEntry: current.sma200,
        regime: current.close >= current.sma200 ? 'BULL' : 'BEAR'
      };
    }
  }

  // Calculate Cumulative Performance & Daily Equity Curve
  const initialCapital = 100000;
  const equityCurve: EquityPoint[] = [];
  const drawdownCurve: DrawdownPoint[] = [];

  const startIndex = 200;
  const initialBenchmarkPrice = candles[startIndex].close;
  
  let currentCapital = initialCapital;
  let peakCapital = initialCapital;
  let benchmarkPeak = initialBenchmarkPrice;
  let maxDrawdownPct = 0;
  let benchmarkMaxDrawdownPct = 0;

  // Map trades by active day span
  const dayInTradeMap = new Map<number, TradeRecord>();
  trades.forEach(t => {
    for (let d = t.entryIndex; d <= t.exitIndex; d++) {
      dayInTradeMap.set(d, t);
    }
  });

  const dailyReturns: number[] = [];

  for (let i = startIndex; i < candles.length; i++) {
    const candle = candles[i];
    const prevCandle = candles[i - 1];
    const tradeToday = dayInTradeMap.get(i);
    const benchmarkValue = (candle.close / initialBenchmarkPrice) * initialCapital;

    let strategyDailyReturn = 0;
    if (tradeToday) {
      if (i === tradeToday.entryIndex) {
        // Trade entered today
        strategyDailyReturn = ((candle.close - tradeToday.entryPrice) / tradeToday.entryPrice);
      } else {
        strategyDailyReturn = ((candle.close - prevCandle.close) / prevCandle.close);
      }
    }

    currentCapital = currentCapital * (1 + strategyDailyReturn);
    if (currentCapital > peakCapital) peakCapital = currentCapital;
    if (benchmarkValue > benchmarkPeak) benchmarkPeak = benchmarkValue;

    const stratDD = ((peakCapital - currentCapital) / peakCapital) * 100;
    const benchDD = ((benchmarkPeak - benchmarkValue) / benchmarkPeak) * 100;

    if (stratDD > maxDrawdownPct) maxDrawdownPct = stratDD;
    if (benchDD > benchmarkMaxDrawdownPct) benchmarkMaxDrawdownPct = benchDD;

    dailyReturns.push(strategyDailyReturn);

    equityCurve.push({
      date: candle.date,
      strategyValue: Math.round(currentCapital),
      benchmarkValue: Math.round(benchmarkValue),
      niftyClose: candle.close,
      inTrade: !!tradeToday,
      tradeReturn: tradeToday ? tradeToday.netReturnPct : undefined
    });

    drawdownCurve.push({
      date: candle.date,
      strategyDrawdownPct: Math.round(-stratDD * 100) / 100,
      benchmarkDrawdownPct: Math.round(-benchDD * 100) / 100
    });
  }

  // Calculate Statistics
  const totalTrades = trades.length;
  const winningTrades = trades.filter(t => t.isWin).length;
  const losingTrades = totalTrades - winningTrades;
  const winRatePct = totalTrades > 0 ? Math.round((winningTrades / totalTrades) * 1000) / 10 : 0;

  const totalGrossWin = trades.filter(t => t.netReturnPct > 0).reduce((sum, t) => sum + t.netReturnPct, 0);
  const totalGrossLoss = Math.abs(trades.filter(t => t.netReturnPct <= 0).reduce((sum, t) => sum + t.netReturnPct, 0));
  const profitFactor = totalGrossLoss > 0 ? Math.round((totalGrossWin / totalGrossLoss) * 100) / 100 : totalGrossWin > 0 ? 99.9 : 0;

  const averageTradeReturnPct = totalTrades > 0 ? Math.round((trades.reduce((s, t) => s + t.netReturnPct, 0) / totalTrades) * 100) / 100 : 0;
  const wins = trades.filter(t => t.netReturnPct > 0);
  const losses = trades.filter(t => t.netReturnPct <= 0);
  const averageWinReturnPct = wins.length > 0 ? Math.round((wins.reduce((s, t) => s + t.netReturnPct, 0) / wins.length) * 100) / 100 : 0;
  const averageLossReturnPct = losses.length > 0 ? Math.round((losses.reduce((s, t) => s + t.netReturnPct, 0) / losses.length) * 100) / 100 : 0;

  const bestTradePct = totalTrades > 0 ? Math.max(...trades.map(t => t.netReturnPct)) : 0;
  const worstTradePct = totalTrades > 0 ? Math.min(...trades.map(t => t.netReturnPct)) : 0;

  const totalYears = (candles.length - startIndex) / 252;
  const strategyReturnTotal = ((currentCapital - initialCapital) / initialCapital);
  const benchmarkReturnTotal = ((candles[candles.length - 1].close - initialBenchmarkPrice) / initialBenchmarkPrice);

  const cagrStrategyPct = totalYears > 0 ? Math.round((Math.pow(1 + strategyReturnTotal, 1 / totalYears) - 1) * 1000) / 10 : 0;
  const cagrBenchmarkPct = totalYears > 0 ? Math.round((Math.pow(1 + benchmarkReturnTotal, 1 / totalYears) - 1) * 1000) / 10 : 0;

  // Annualized Sharpe Ratio (assuming 6% risk-free rate)
  const rfDaily = 0.06 / 252;
  const meanExcessReturn = dailyReturns.reduce((s, r) => s + (r - rfDaily), 0) / dailyReturns.length;
  const variance = dailyReturns.reduce((s, r) => s + Math.pow(r - rfDaily - meanExcessReturn, 2), 0) / (dailyReturns.length - 1);
  const dailyStdev = Math.sqrt(variance);
  const sharpeRatio = dailyStdev > 0 ? Math.round((meanExcessReturn / dailyStdev) * Math.sqrt(252) * 100) / 100 : 0;

  // Downside deviation for Sortino Ratio
  const downsideVariance = dailyReturns.filter(r => r < 0).reduce((s, r) => s + Math.pow(r, 2), 0) / dailyReturns.length;
  const downsideStdev = Math.sqrt(downsideVariance);
  const sortinoRatio = downsideStdev > 0 ? Math.round((meanExcessReturn / downsideStdev) * Math.sqrt(252) * 100) / 100 : 0;

  const marketExposureDays = dayInTradeMap.size;
  const exposureDaysPct = Math.round((marketExposureDays / (candles.length - startIndex)) * 1000) / 10;

  return {
    totalTrades,
    winningTrades,
    losingTrades,
    winRatePct,
    profitFactor,
    averageTradeReturnPct,
    averageWinReturnPct,
    averageLossReturnPct,
    bestTradePct,
    worstTradePct,
    maxDrawdownPct: Math.round(maxDrawdownPct * 10) / 10,
    benchmarkMaxDrawdownPct: Math.round(benchmarkMaxDrawdownPct * 10) / 10,
    cagrStrategyPct,
    cagrBenchmarkPct,
    sharpeRatio,
    sortinoRatio,
    trades,
    equityCurve,
    drawdownCurve,
    exposureDaysPct
  };
}
