import React, { useState } from 'react';
import { SensitivityCell } from '../types/research';
import { Grid, Layers } from 'lucide-react';

interface SensitivityHeatmapProps {
  thresholds: number[];
  holdingDaysList: number[];
  matrix: SensitivityCell[][];
  currentThreshold: number;
  currentHoldingDays: number;
  onSelectCell: (threshold: number, holdingDays: number) => void;
}

export const SensitivityHeatmap: React.FC<SensitivityHeatmapProps> = ({
  thresholds,
  holdingDaysList,
  matrix,
  currentThreshold,
  currentHoldingDays,
  onSelectCell,
}) => {
  const [metric, setMetric] = useState<'winRate' | 'avgReturn' | 'trades'>('winRate');

  // Helper for color coding
  const getCellColor = (cell: SensitivityCell) => {
    const isCurrent = cell.fallThresholdPct === currentThreshold && cell.holdingDays === currentHoldingDays;

    if (metric === 'winRate') {
      const rate = cell.winRatePct;
      if (rate >= 65) return isCurrent ? 'bg-emerald-500 text-slate-950 ring-2 ring-white font-bold' : 'bg-emerald-600/70 text-emerald-100 hover:bg-emerald-500';
      if (rate >= 55) return isCurrent ? 'bg-emerald-600/50 text-emerald-100 ring-2 ring-white font-bold' : 'bg-emerald-700/40 text-emerald-200 hover:bg-emerald-600/50';
      if (rate >= 50) return isCurrent ? 'bg-slate-700 text-slate-100 ring-2 ring-white font-bold' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700';
      return isCurrent ? 'bg-rose-900/80 text-rose-200 ring-2 ring-white font-bold' : 'bg-rose-950/40 text-rose-300 hover:bg-rose-900/60';
    } else if (metric === 'avgReturn') {
      const ret = cell.avgReturnPct;
      if (ret >= 1.5) return isCurrent ? 'bg-emerald-500 text-slate-950 ring-2 ring-white font-bold' : 'bg-emerald-600/80 text-emerald-100 hover:bg-emerald-500';
      if (ret > 0.5) return isCurrent ? 'bg-emerald-600/50 text-emerald-100 ring-2 ring-white font-bold' : 'bg-emerald-700/40 text-emerald-200 hover:bg-emerald-600/50';
      if (ret >= 0) return isCurrent ? 'bg-slate-700 text-slate-100 ring-2 ring-white font-bold' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700';
      return isCurrent ? 'bg-rose-900/80 text-rose-200 ring-2 ring-white font-bold' : 'bg-rose-950/40 text-rose-300 hover:bg-rose-900/60';
    } else {
      return isCurrent ? 'bg-indigo-600 text-white ring-2 ring-white font-bold' : 'bg-slate-800/80 text-slate-200 hover:bg-indigo-950';
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Grid className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Parameter Sensitivity Grid
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Overfitting / P-Hacking Check
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Evaluates whether the edge is stable across neighboring drop thresholds and holding horizons.
            </p>
          </div>
        </div>

        {/* Metric Selector */}
        <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setMetric('winRate')}
            className={`px-2.5 py-1 rounded-lg transition ${metric === 'winRate' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400'}`}
          >
            Win Rate %
          </button>
          <button
            onClick={() => setMetric('avgReturn')}
            className={`px-2.5 py-1 rounded-lg transition ${metric === 'avgReturn' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400'}`}
          >
            Avg Return %
          </button>
          <button
            onClick={() => setMetric('trades')}
            className={`px-2.5 py-1 rounded-lg transition ${metric === 'trades' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400'}`}
          >
            Sample Size (N)
          </button>
        </div>
      </div>

      {/* Heatmap Grid Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr>
              <th className="p-2 text-[11px] font-semibold text-slate-400 text-left bg-slate-900/60 rounded-tl-lg">
                Drop Threshold
              </th>
              {holdingDaysList.map((h) => (
                <th key={h} className="p-2 text-[11px] font-semibold text-slate-300 bg-slate-900/60">
                  {h} Days
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {matrix.map((row, rIdx) => {
              const threshold = thresholds[rIdx];
              return (
                <tr key={threshold}>
                  <td className="p-2 text-xs font-mono font-bold text-slate-300 text-left bg-slate-900/30">
                    {threshold}%
                  </td>
                  {row.map((cell) => {
                    return (
                      <td key={`${cell.fallThresholdPct}-${cell.holdingDays}`} className="p-1">
                        <button
                          onClick={() => onSelectCell(cell.fallThresholdPct, cell.holdingDays)}
                          className={`w-full py-2 px-1 rounded-lg text-xs transition font-mono ${getCellColor(cell)}`}
                          title={`Threshold: ${cell.fallThresholdPct}%, Holding: ${cell.holdingDays}d, Trades: ${cell.totalTrades}, WinRate: ${cell.winRatePct}%, AvgReturn: ${cell.avgReturnPct}%`}
                        >
                          {metric === 'winRate' && `${cell.winRatePct}%`}
                          {metric === 'avgReturn' && `${cell.avgReturnPct > 0 ? '+' : ''}${cell.avgReturnPct}%`}
                          {metric === 'trades' && `N=${cell.totalTrades}`}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800">
        <span className="flex items-center gap-1.5 text-slate-300">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          Click any cell above to instantly re-test and inspect specific parameters.
        </span>
        <span className="text-[10px] text-slate-400 font-mono">
          White outline = currently active experiment
        </span>
      </div>
    </div>
  );
};
