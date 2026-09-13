export type ResearchStage = 'ASK' | 'CLARIFY' | 'DEFINE' | 'TEST' | 'LEARN';

export type ParameterTag = 'USER_STATED' | 'SYSTEM_INFERRED' | 'USER_CONFIGURED';

export interface ParameterMetadata {
  id: string;
  name: string;
  value: string | number | boolean;
  unit?: string;
  tag: ParameterTag;
  userPromptBasis: string;
  systemRationale: string;
  options?: { label: string; value: string | number }[];
}

export interface ExperimentParams {
  instrument: string;
  fallType: 'single_day' | 'multi_day' | 'rsi_oversold' | 'volatility_shock';
  fallThresholdPct: number; // e.g. -2.0 for -2%
  multiDayWindow: number; // e.g. 3 days
  rsiThreshold: number; // e.g. 30
  entryTiming: 'same_day_close' | 'next_day_open';
  exitType: 'fixed_days' | 'target_stop' | 'hybrid';
  holdingDays: number; // e.g. 5 days
  targetProfitPct: number; // e.g. 3.0%
  stopLossPct: number; // e.g. 2.0%
  trendFilter: 'none' | 'above_200_sma' | 'below_200_sma';
  regimeFilterVix: 'none' | 'low_vix' | 'high_vix'; // e.g. VIX < 22 vs > 22
  slippagePct: number; // e.g. 0.05% per leg
  frictionCostPct: number; // STT + Exchange + Brokerage ~ 0.05%
  testPeriodStart: string;
  testPeriodEnd: string;
}

export interface TradeRecord {
  id: number;
  entryDate: string;
  entryIndex: number;
  entryPrice: number;
  exitDate: string;
  exitIndex: number;
  exitPrice: number;
  exitReason: 'TIME_EXPIRED' | 'TARGET_HIT' | 'STOP_LOSS_HIT' | 'END_OF_DATA';
  holdingPeriodDays: number;
  grossReturnPct: number;
  netReturnPct: number;
  triggerDropPct: number;
  isWin: boolean;
  sma200AtEntry: number;
  regime: 'BULL' | 'BEAR';
}

export interface EquityPoint {
  date: string;
  strategyValue: number; // indexed at 100 or 100,000
  benchmarkValue: number;
  niftyClose: number;
  inTrade: boolean;
  tradeReturn?: number;
}

export interface DrawdownPoint {
  date: string;
  strategyDrawdownPct: number;
  benchmarkDrawdownPct: number;
}

export interface BacktestResult {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRatePct: number;
  profitFactor: number;
  averageTradeReturnPct: number;
  averageWinReturnPct: number;
  averageLossReturnPct: number;
  bestTradePct: number;
  worstTradePct: number;
  maxDrawdownPct: number;
  benchmarkMaxDrawdownPct: number;
  cagrStrategyPct: number;
  cagrBenchmarkPct: number;
  sharpeRatio: number;
  sortinoRatio: number;
  trades: TradeRecord[];
  equityCurve: EquityPoint[];
  drawdownCurve: DrawdownPoint[];
  exposureDaysPct: number;
}

export interface SensitivityCell {
  fallThresholdPct: number;
  holdingDays: number;
  totalTrades: number;
  winRatePct: number;
  avgReturnPct: number;
  profitFactor: number;
  sharpeRatio: number;
}

export interface RiskAuditItem {
  id: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  category: 'Look-Ahead Bias' | 'Execution Friction' | 'Regime Risk' | 'Statistical Power' | 'Survivorship Bias';
  finding: string;
  evidence: string;
  recommendedMitigation: string;
}

export interface FollowUpHypothesis {
  id: string;
  title: string;
  hypothesis: string;
  rationale: string;
  patch: Partial<ExperimentParams>;
  badge: string;
}
