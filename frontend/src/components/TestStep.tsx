import React, { useState } from 'react';
import { BacktestResult, ExperimentParams, SensitivityCell } from '../types/research';
import { EquityChart } from './EquityChart';
import { SensitivityHeatmap } from './SensitivityHeatmap';
import { PlayCircle, ArrowRight, ArrowLeft, TrendingUp, ShieldCheck, Activity, Award, Percent, Calendar, CheckCircle2, XCircle } from 'lucide-react';

interface TestStepProps {
  params: ExperimentParams;
  setParams: React.Dispatch<React.SetStateAction<ExperimentParams>>;
  results: BacktestResult;
  sensitivity: {
    thresholds: number[];
    holdingDaysList: number[];
    matrix: SensitivityCell[][];
  };
  onProceedToLearn: () => void;
  onBackToDefine: () => void;
}

export const TestStep: React.FC<TestStepProps> = ({
  params,
  setParams,
  results,
  sensitivity,
  onProceedToLearn,
  onBackToDefine,
}) => {
  const [tradeFilter, setTradeFilter] = useState<'ALL' | 'WINS' | 'LOSSES'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filteredTrades = results.trades.filter((t) => {
    if (tradeFilter === 'WINS') return t.isWin;
    if (tradeFilter === 'LOSSES') return !t.isWin;
    return true;
  });

  const totalPages = Math.ceil(filteredTrades.length / pageSize);
  const paginatedTrades = filteredTrades.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSelectCell = (threshold: number, holdingDays: number) => {
    setParams((prev) => ({
      ...prev,
      fallThresholdPct: threshold,
      holdingDays: holdingDays,
    }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wide">
          <PlayCircle className="w-3.5 h-3.5" />
          <span>Stage 4: Quantitative Backtest Execution & Empirical Evidence</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Empirical Backtest Results (2014–2024)
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Deterministic simulation executing every historical single-day drop on the NIFTY 50 benchmark.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono">
              Tested Condition: <strong className="text-indigo-400">Drop ≤ {params.fallThresholdPct}%</strong>, Hold <strong className="text-indigo-400">{params.holdingDays}d</strong>
            </span>
          </div>
        </div>
      </div>

      {/* KPI Performance Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Sample Size (N) */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-indigo-400" />
            <span>Sample (N)</span>
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {results.totalTrades}
          </div>
          <div className="text-[10px] text-slate-400">
            {results.totalTrades >= 30 ? 'Statistically Adequate' : 'Small Sample Warning'}
          </div>
        </div>

        {/* Win Rate */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Percent className="w-3.5 h-3.5 text-emerald-400" />
            <span>Win Rate</span>
          </div>
          <div className={`text-2xl font-bold font-mono ${results.winRatePct >= 55 ? 'text-emerald-400' : 'text-slate-200'}`}>
            {results.winRatePct}%
          </div>
          <div className="text-[10px] text-slate-400">
            {results.winningTrades}W / {results.losingTrades}L
          </div>
        </div>

        {/* Average Trade Return */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
            <span>Avg Return</span>
          </div>
          <div className={`text-2xl font-bold font-mono ${results.averageTradeReturnPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {results.averageTradeReturnPct >= 0 ? '+' : ''}{results.averageTradeReturnPct}%
          </div>
          <div className="text-[10px] text-slate-400">
            Per {params.holdingDays}d trade (Net)
          </div>
        </div>

        {/* Profit Factor */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Profit Factor</span>
          </div>
          <div className="text-2xl font-bold text-amber-400 font-mono">
            {results.profitFactor}
          </div>
          <div className="text-[10px] text-slate-400">
            Gross Win / Gross Loss
          </div>
        </div>

        {/* Max Drawdown */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
            <span>Max DD</span>
          </div>
          <div className="text-2xl font-bold text-rose-400 font-mono">
            -{results.maxDrawdownPct}%
          </div>
          <div className="text-[10px] text-slate-400">
            vs -{results.benchmarkMaxDrawdownPct}% Benchmark
          </div>
        </div>

        {/* Sharpe Ratio */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-purple-400" />
            <span>Sharpe Ratio</span>
          </div>
          <div className="text-2xl font-bold text-purple-400 font-mono">
            {results.sharpeRatio}
          </div>
          <div className="text-[10px] text-slate-400">
            Market Exposure: {results.exposureDaysPct}%
          </div>
        </div>
      </div>

      {/* Main Visualizations: Chart + Sensitivity Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EquityChart equityCurve={results.equityCurve} drawdownCurve={results.drawdownCurve} />
        <SensitivityHeatmap
          thresholds={sensitivity.thresholds}
          holdingDaysList={sensitivity.holdingDaysList}
          matrix={sensitivity.matrix}
          currentThreshold={params.fallThresholdPct}
          currentHoldingDays={params.holdingDays}
          onSelectCell={handleSelectCell}
        />
      </div>

      {/* Historical Trades Log Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800 shadow-xl space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Individual Trade Audit Log ({filteredTrades.length} trades)
            </h3>
            <p className="text-[11px] text-slate-400">
              Granular breakdown of every historical entry, trigger shock magnitude, exit, and net return.
            </p>
          </div>

          <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => { setTradeFilter('ALL'); setCurrentPage(1); }}
              className={`px-3 py-1 rounded-lg transition ${tradeFilter === 'ALL' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400'}`}
            >
              All ({results.trades.length})
            </button>
            <button
              onClick={() => { setTradeFilter('WINS'); setCurrentPage(1); }}
              className={`px-3 py-1 rounded-lg transition ${tradeFilter === 'WINS' ? 'bg-emerald-600 text-white font-medium' : 'text-slate-400'}`}
            >
              Wins ({results.winningTrades})
            </button>
            <button
              onClick={() => { setTradeFilter('LOSSES'); setCurrentPage(1); }}
              className={`px-3 py-1 rounded-lg transition ${tradeFilter === 'LOSSES' ? 'bg-rose-600 text-white font-medium' : 'text-slate-400'}`}
            >
              Losses ({results.losingTrades})
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Entry Date</th>
                <th className="py-2.5 px-3">Trigger Drop</th>
                <th className="py-2.5 px-3">Entry Price</th>
                <th className="py-2.5 px-3">Exit Date</th>
                <th className="py-2.5 px-3">Exit Price</th>
                <th className="py-2.5 px-3">Holding</th>
                <th className="py-2.5 px-3">Regime</th>
                <th className="py-2.5 px-3 text-right">Net Return</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {paginatedTrades.map((t) => (
                <tr key={t.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-2 px-3 text-slate-400">{t.id}</td>
                  <td className="py-2 px-3 text-slate-200">{t.entryDate}</td>
                  <td className="py-2 px-3 text-rose-400 font-semibold">{t.triggerDropPct}%</td>
                  <td className="py-2 px-3 text-slate-300">₹{t.entryPrice.toLocaleString('en-IN')}</td>
                  <td className="py-2 px-3 text-slate-200">{t.exitDate}</td>
                  <td className="py-2 px-3 text-slate-300">₹{t.exitPrice.toLocaleString('en-IN')}</td>
                  <td className="py-2 px-3 text-slate-400">{t.holdingPeriodDays}d</td>
                  <td className="py-2 px-3">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-sans ${t.regime === 'BULL' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'}`}>
                      {t.regime}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right">
                    <span className={`font-bold inline-flex items-center space-x-1 ${t.isWin ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {t.isWin ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                      <span>{t.netReturnPct > 0 ? '+' : ''}{t.netReturnPct}%</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2 text-xs text-slate-400">
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center space-x-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-2.5 py-1 rounded bg-slate-800 disabled:opacity-40 hover:bg-slate-700 text-slate-200"
              >
                Previous
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-2.5 py-1 rounded bg-slate-800 disabled:opacity-40 hover:bg-slate-700 text-slate-200"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <button
          onClick={onBackToDefine}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Experiment Spec</span>
        </button>

        <button
          onClick={onProceedToLearn}
          className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 transition transform hover:-translate-y-0.5"
        >
          <span>Synthesize Findings & Epistemic Learnings</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
