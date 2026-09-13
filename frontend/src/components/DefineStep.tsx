import React from 'react';
import { ExperimentParams } from '../types/research';
import { ParsedQueryDecomposition } from '../engine/nlpParser';
import { FileSpreadsheet, ArrowRight, ArrowLeft, Play, ShieldAlert, CheckCircle, Database } from 'lucide-react';

interface DefineStepProps {
  userQuery?: string;
  params: ExperimentParams;
  parsedQuery?: ParsedQueryDecomposition;
  onRunTest: () => void;
  onBackToClarify: () => void;
}

export const DefineStep: React.FC<DefineStepProps> = ({
  params,
  onRunTest,
  onBackToClarify,
}) => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-wide">
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Stage 3: Structured Experiment Formulation</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Experiment Specification Card
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              The intuitive inquiry is now translated into an immutable, audit-ready quantitative experiment definition.
            </p>
          </div>
        </div>
      </div>

      {/* Formal Scientific Hypotheses Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-panel p-5 rounded-xl border border-indigo-500/30 bg-indigo-950/20 space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 w-16 h-16 bg-indigo-500/10 rounded-full blur-xl pointer-events-none"></div>
          <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" /> Alternative Hypothesis (H₁)
          </span>
          <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
            "A single-day decline &le; {params.fallThresholdPct}% in NIFTY 50 creates an oversold structural imbalance where forward {params.holdingDays}-day mean returns are statistically positive and exceed frictionless random baseline returns."
          </p>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-slate-700/60 bg-slate-900/40 space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" /> Null Hypothesis (H₀)
          </span>
          <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">
            "Forward returns following a {params.fallThresholdPct}% decline do not statistically differ from random {params.holdingDays}-day market holding returns (H₀: &mu;[drop] &le; &mu;[random])."
          </p>
        </div>
      </div>

      {/* Structured Experiment Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm font-bold text-slate-200">
            <Database className="w-4 h-4 text-indigo-400" />
            <span>Formal Research Experiment Parameters</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">Dataset: 2014-2024 (2,600+ Sessions)</span>
        </div>

        <div className="divide-y divide-slate-800/80 text-xs">
          {/* Market */}
          <div className="grid grid-cols-1 sm:grid-cols-3 p-4 hover:bg-slate-800/20 transition">
            <div className="font-semibold text-slate-400 uppercase tracking-wider text-[11px]">
              Market / Asset
            </div>
            <div className="sm:col-span-2 text-slate-200 font-medium flex items-center justify-between">
              <span>{params.instrument} (National Stock Exchange Benchmark)</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">User Stated</span>
            </div>
          </div>

          {/* Trigger Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-3 p-4 hover:bg-slate-800/20 transition">
            <div className="font-semibold text-slate-400 uppercase tracking-wider text-[11px]">
              Trigger Condition
            </div>
            <div className="sm:col-span-2 text-slate-200 font-medium flex items-center justify-between">
              <span>Daily Close-to-Close Return &le; {params.fallThresholdPct}%</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">Clarified</span>
            </div>
          </div>

          {/* Entry Execution */}
          <div className="grid grid-cols-1 sm:grid-cols-3 p-4 hover:bg-slate-800/20 transition">
            <div className="font-semibold text-slate-400 uppercase tracking-wider text-[11px]">
              Entry Execution
            </div>
            <div className="sm:col-span-2 text-slate-200 font-medium flex items-center justify-between">
              <span>
                {params.entryTiming === 'same_day_close'
                  ? 'Same-Day Market Close (3:20 PM MOC auction price)'
                  : 'Next-Day Market Open (9:15 AM MOO)'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">Defined</span>
            </div>
          </div>

          {/* Exit Rule & Holding Horizon */}
          <div className="grid grid-cols-1 sm:grid-cols-3 p-4 hover:bg-slate-800/20 transition">
            <div className="font-semibold text-slate-400 uppercase tracking-wider text-[11px]">
              Exit & Holding Horizon
            </div>
            <div className="sm:col-span-2 text-slate-200 font-medium flex items-center justify-between">
              <span>
                {params.exitType === 'fixed_days'
                  ? `Fixed ${params.holdingDays} Trading Days (${params.holdingDays * 1} sessions) exit at Market Close`
                  : `Target Profit +${params.targetProfitPct}% / Stop Loss -${params.stopLossPct}% or ${params.holdingDays}d max`}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">Defined</span>
            </div>
          </div>

          {/* Trend Regime Filter */}
          <div className="grid grid-cols-1 sm:grid-cols-3 p-4 hover:bg-slate-800/20 transition">
            <div className="font-semibold text-slate-400 uppercase tracking-wider text-[11px]">
              Regime Filter
            </div>
            <div className="sm:col-span-2 text-slate-200 font-medium flex items-center justify-between">
              <span>
                {params.trendFilter === 'above_200_sma'
                  ? 'Active: Only trigger when NIFTY Close ≥ 200 SMA (Bull Regime)'
                  : params.trendFilter === 'below_200_sma'
                  ? 'Active: Only trigger when NIFTY Close < 200 SMA (Bear Regime)'
                  : 'Disabled: All Historical Regimes Included'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">Configured</span>
            </div>
          </div>

          {/* Cost & Slippage Assumptions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 p-4 hover:bg-slate-800/20 transition">
            <div className="font-semibold text-slate-400 uppercase tracking-wider text-[11px]">
              Cost Assumptions
            </div>
            <div className="sm:col-span-2 text-slate-200 font-medium flex items-center justify-between">
              <span>{(params.slippagePct * 2 + params.frictionCostPct).toFixed(2)}% Round-Trip Drag (0.10% Slippage + STT/Turnover)</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">Frictions Model</span>
            </div>
          </div>

          {/* Test Dataset Window */}
          <div className="grid grid-cols-1 sm:grid-cols-3 p-4 hover:bg-slate-800/20 transition">
            <div className="font-semibold text-slate-400 uppercase tracking-wider text-[11px]">
              Sample Test Period
            </div>
            <div className="sm:col-span-2 text-slate-200 font-medium flex items-center justify-between">
              <span>10-Year Daily Time-Series (Jan 2014 – Dec 2024, 2,600+ Trading Days)</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">Daily OHLCV</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <button
          onClick={onBackToClarify}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Modify Assumptions</span>
        </button>

        <button
          onClick={onRunTest}
          className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white text-sm font-bold shadow-lg shadow-emerald-600/30 transition transform hover:-translate-y-0.5"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Execute Backtest & Generate Evidence</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
