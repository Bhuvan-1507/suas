import { ExperimentParams, ParameterMetadata } from '../types/research';

export interface ParsedQueryDecomposition {
  originalQuery: string;
  identifiedSubject: string;
  identifiedAction: 'LONG' | 'SHORT';
  triggerCondition: string;
  ambiguitiesIdentified: {
    key: string;
    aspect: string;
    userQueryWording: string;
    missingDetails: string;
    defaultProposed: string;
    severity: 'CRITICAL' | 'IMPORTANT' | 'MODERATE';
  }[];
  extractedParameters: ParameterMetadata[];
  defaultParams: ExperimentParams;
  formalHypothesis: string;
  nullHypothesis: string;
}

export function parseTradingQuery(query: string): ParsedQueryDecomposition {
  const normalized = query.toLowerCase().trim();
  
  // Detection logic
  const isMultiDay = normalized.includes('consecutive') || normalized.includes('days') || normalized.includes('multi');
  const isRsi = normalized.includes('rsi') || normalized.includes('oversold');
  const hasPercentage = normalized.match(/(-?\d+(\.\d+)?)%/);
  
  let fallThreshold = -2.0;
  if (hasPercentage) {
    const val = parseFloat(hasPercentage[1]);
    fallThreshold = val > 0 ? -val : val;
  } else if (normalized.includes('massive') || normalized.includes('panic') || normalized.includes('crash')) {
    fallThreshold = -3.5;
  } else if (normalized.includes('mild') || normalized.includes('small')) {
    fallThreshold = -1.0;
  }

  let fallType: 'single_day' | 'multi_day' | 'rsi_oversold' | 'volatility_shock' = 'single_day';
  if (isRsi) fallType = 'rsi_oversold';
  else if (isMultiDay) fallType = 'multi_day';

  const defaultParams: ExperimentParams = {
    instrument: 'NIFTY 50 Index',
    fallType,
    fallThresholdPct: fallThreshold,
    multiDayWindow: 3,
    rsiThreshold: 30,
    entryTiming: 'same_day_close',
    exitType: 'fixed_days',
    holdingDays: 5,
    targetProfitPct: 3.0,
    stopLossPct: 2.0,
    trendFilter: 'none',
    regimeFilterVix: 'none',
    slippagePct: 0.05,
    frictionCostPct: 0.05,
    testPeriodStart: '2014-01-01',
    testPeriodEnd: '2024-12-31'
  };

  const extractedParameters: ParameterMetadata[] = [
    {
      id: 'param-instrument',
      name: 'Underlying Asset',
      value: 'NIFTY 50 Index',
      tag: 'USER_STATED',
      userPromptBasis: 'User explicitly named "NIFTY"',
      systemRationale: 'Mapped directly to the NSE benchmark NIFTY 50 Index daily series.',
      options: [
        { label: 'NIFTY 50 Index', value: 'NIFTY 50 Index' },
        { label: 'BANKNIFTY Index', value: 'BANKNIFTY Index' }
      ]
    },
    {
      id: 'param-direction',
      name: 'Trade Direction',
      value: 'Long (Buy)',
      tag: 'USER_STATED',
      userPromptBasis: 'User explicitly asked about "buying"',
      systemRationale: 'Mean-reversion long bias testing against dip bottoms.',
      options: [
        { label: 'Long (Buy)', value: 'Long' }
      ]
    },
    {
      id: 'param-fall-threshold',
      name: 'Definition of "Sharp Fall"',
      value: `${fallThreshold}% in 1 Day`,
      unit: '%',
      tag: hasPercentage ? 'USER_STATED' : 'SYSTEM_INFERRED',
      userPromptBasis: hasPercentage ? `User specified ${hasPercentage[0]}` : 'User used vague term "sharp fall"',
      systemRationale: 'A -2.0% single-day decline in NIFTY represents an approximate 2.2-sigma standard deviation shock.',
      options: [
        { label: '-1.5% (Moderate Dip)', value: -1.5 },
        { label: '-2.0% (Standard Shock - 2σ)', value: -2.0 },
        { label: '-3.0% (Severe Panic - 3σ)', value: -3.0 },
        { label: '-4.0% (Black Swan Crash)', value: -4.0 }
      ]
    },
    {
      id: 'param-entry-timing',
      name: 'Entry Timing',
      value: 'Market Close on Drop Day (3:20 PM)',
      tag: 'SYSTEM_INFERRED',
      userPromptBasis: 'User said "after a sharp fall" without specifying execution clock',
      systemRationale: 'Entering at 3:20 PM Market-On-Close (MOC) locks in the confirmed daily drop without overnight gap risk.',
      options: [
        { label: 'Same-day Market Close (3:20 PM MOC)', value: 'same_day_close' },
        { label: 'Next-day Market Open (9:15 AM MOO)', value: 'next_day_open' }
      ]
    },
    {
      id: 'param-holding-period',
      name: 'Exit Strategy / Holding Horizon',
      value: '5 Trading Days (1 Calendar Week)',
      unit: 'days',
      tag: 'SYSTEM_INFERRED',
      userPromptBasis: 'User did not specify when to sell or exit',
      systemRationale: '5 trading days is standard for short-term institutional swing mean-reversion rebalancing.',
      options: [
        { label: '1 Day (Next Day Flip)', value: 1 },
        { label: '3 Days (Short Bounce)', value: 3 },
        { label: '5 Days (1 Trading Week)', value: 5 },
        { label: '10 Days (2 Weeks Cycle)', value: 10 },
        { label: '20 Days (1 Month Mean Reversion)', value: 20 }
      ]
    },
    {
      id: 'param-trend-filter',
      name: 'Macro Trend Regime Filter',
      value: 'All Regimes (No 200 SMA Filter)',
      tag: 'SYSTEM_INFERRED',
      userPromptBasis: 'User did not restrict to bull or bear markets',
      systemRationale: 'Default evaluates all historical drops. Allows toggling to compare bull dips vs bear falling knives.',
      options: [
        { label: 'All Regimes (No Filter)', value: 'none' },
        { label: 'Only Above 200 SMA (Bull Trend Dips)', value: 'above_200_sma' },
        { label: 'Only Below 200 SMA (Bear Market Capitulation)', value: 'below_200_sma' }
      ]
    },
    {
      id: 'param-frictions',
      name: 'Transaction Costs & Slippage',
      value: '0.10% Round-Trip (0.05% Slippage + 0.05% STT/Brokerage)',
      tag: 'SYSTEM_INFERRED',
      userPromptBasis: 'Retail query assumes zero friction',
      systemRationale: 'Real trading requires STT, exchange turnover fees, GST, SEBI charges, and bid-ask slippage.',
      options: [
        { label: '0.10% Round-Trip (Realistic Futures/ETF)', value: 0.10 },
        { label: '0.20% Round-Trip (Higher Friction Options/Delivery)', value: 0.20 },
        { label: '0.00% (Theoretical Frictionless)', value: 0.00 }
      ]
    }
  ];

  return {
    originalQuery: query,
    identifiedSubject: 'NIFTY 50 Index',
    identifiedAction: 'LONG',
    triggerCondition: `Single-day drop ≤ ${fallThreshold}%`,
    ambiguitiesIdentified: [
      {
        key: 'fall_magnitude',
        aspect: 'Definition of "Sharp Fall"',
        userQueryWording: '"sharp fall"',
        missingDetails: 'No numerical percentage, point decline, or statistical dispersion specified.',
        defaultProposed: `${fallThreshold}% daily decline (~2.2-sigma historical event)`,
        severity: 'CRITICAL'
      },
      {
        key: 'entry_clock',
        aspect: 'Execution Clock & Timing',
        userQueryWording: '"after a sharp fall"',
        missingDetails: 'Does the trader buy at the close of the plunge, or wait for next day open?',
        defaultProposed: 'Enter at Same-day Close (3:20 PM MOC) once the drop is verified.',
        severity: 'IMPORTANT'
      },
      {
        key: 'exit_condition',
        aspect: 'Holding Period & Exit Rules',
        userQueryWording: 'Unstated',
        missingDetails: 'No profit target, stop loss, or holding timeframe specified.',
        defaultProposed: 'Hold for 5 trading days (1 calendar week) fixed horizon.',
        severity: 'CRITICAL'
      },
      {
        key: 'success_criteria',
        aspect: 'Meaning of "Work"',
        userQueryWording: '"work"',
        missingDetails: '"Work" is subjective (Win Rate > 50% vs Sharpe Ratio vs Alpha over Buy & Hold).',
        defaultProposed: 'Assess Positive Expectancy, Win Rate > 55%, and Outperformance vs Buy & Hold.',
        severity: 'IMPORTANT'
      },
      {
        key: 'frictions',
        aspect: 'Frictions & Slippage',
        userQueryWording: 'Unstated',
        missingDetails: 'Ignored exchange fees, STT, and execution bid-ask slippage.',
        defaultProposed: 'Deduct 0.10% round-trip costs per completed trade.',
        severity: 'MODERATE'
      }
    ],
    extractedParameters,
    defaultParams,
    formalHypothesis: `A single-day decline in NIFTY 50 of ${Math.abs(fallThreshold)}% or greater creates short-term oversold conditions that yield statistically positive forward returns over a 5-day holding horizon, with an average trade return exceeding friction-adjusted benchmark baseline.`,
    nullHypothesis: `Forward 5-day returns following a ${Math.abs(fallThreshold)}% drop do not statistically differ from unconditional random 5-day market returns ($H_0: \\mu_{drop} \\le \\mu_{random}$).`
  };
}
