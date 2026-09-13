import { getNifty50Data } from '../data/niftyDataEngine';
import { ExperimentParams, SensitivityCell } from '../types/research';
import { runBacktest } from './backtestEngine';

export function computeSensitivityMatrix(baseParams: ExperimentParams): {
  thresholds: number[];
  holdingDaysList: number[];
  matrix: SensitivityCell[][];
} {
  const dataset = getNifty50Data();
  const thresholds = [-1.0, -1.5, -2.0, -2.5, -3.0, -4.0];
  const holdingDaysList = [1, 3, 5, 10, 20];

  const matrix: SensitivityCell[][] = [];

  for (let t = 0; t < thresholds.length; t++) {
    const row: SensitivityCell[] = [];
    const threshold = thresholds[t];

    for (let h = 0; h < holdingDaysList.length; h++) {
      const holdingDays = holdingDaysList[h];

      const simParams: ExperimentParams = {
        ...baseParams,
        fallThresholdPct: threshold,
        holdingDays: holdingDays
      };

      const result = runBacktest(simParams, dataset);

      row.push({
        fallThresholdPct: threshold,
        holdingDays,
        totalTrades: result.totalTrades,
        winRatePct: result.winRatePct,
        avgReturnPct: result.averageTradeReturnPct,
        profitFactor: result.profitFactor,
        sharpeRatio: result.sharpeRatio
      });
    }
    matrix.push(row);
  }

  return {
    thresholds,
    holdingDaysList,
    matrix
  };
}
