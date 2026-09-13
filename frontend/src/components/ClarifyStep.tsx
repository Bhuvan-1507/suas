import React from 'react';
import { ExperimentParams, ParameterTag } from '../types/research';
import { ParsedQueryDecomposition } from '../engine/nlpParser';
import { Sliders, ArrowRight, ArrowLeft, CheckCircle2, Info } from 'lucide-react';

interface ClarifyStepProps {
  userQuery: string;
  parsedQuery?: ParsedQueryDecomposition;
  params: ExperimentParams;
  setParams: React.Dispatch<React.SetStateAction<ExperimentParams>>;
  onProceedToDefine: () => void;
  onBackToAsk: () => void;
}

export const ClarifyStep: React.FC<ClarifyStepProps> = ({
  userQuery,
  params,
  setParams,
  onProceedToDefine,
  onBackToAsk,
}) => {
  const getBadgeStyle = (tag: ParameterTag) => {
    switch (tag) {
      case 'USER_STATED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'SYSTEM_INFERRED':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      case 'USER_CONFIGURED':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
    }
  };

  const getTagLabel = (tag: ParameterTag) => {
    switch (tag) {
      case 'USER_STATED':
        return 'Explicitly Stated by User';
      case 'SYSTEM_INFERRED':
        return 'System Proposed Default';
      case 'USER_CONFIGURED':
        return 'Customized by User';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Header & Prompt Recap */}
      <div className="space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-wide">
          <Sliders className="w-3.5 h-3.5" />
          <span>Stage 2: Ambiguity Clarification & Assumptions Matrix</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Resolving Missing Parameters
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Trading questions are often ambiguous. Below is how the system interprets and quantifies your query with clear rationale.
            </p>
          </div>
          <div className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <span className="text-slate-500 block">Original Question:</span>
            <span className="font-semibold text-indigo-300">"{userQuery}"</span>
          </div>
        </div>
      </div>

      {/* Epistemic Clarification Legend Banner */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-wrap items-center gap-3 sm:gap-6 text-xs text-slate-300">
        <span className="font-semibold text-slate-200 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-indigo-400" /> Parameter Origin:
        </span>
        <span className="inline-flex items-center px-2.5 py-1 rounded-md border bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5"></span>
          User Stated
        </span>
        <span className="inline-flex items-center px-2.5 py-1 rounded-md border bg-indigo-500/10 text-indigo-400 border-indigo-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mr-1.5"></span>
          System Inferred (Default)
        </span>
        <span className="inline-flex items-center px-2.5 py-1 rounded-md border bg-cyan-500/10 text-cyan-400 border-cyan-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mr-1.5"></span>
          User Configured
        </span>
      </div>

      {/* Clarification Cards Grid */}
      <div className="space-y-4">
        {/* 1. Sharp Fall Definition Card */}
        <div className="glass-panel rounded-xl p-5 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-slate-100 text-base">1. Define "Sharp Fall" Magnitude</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${getBadgeStyle(params.fallThresholdPct !== -2.0 ? 'USER_CONFIGURED' : 'SYSTEM_INFERRED')}`}>
                  {getTagLabel(params.fallThresholdPct !== -2.0 ? 'USER_CONFIGURED' : 'SYSTEM_INFERRED')}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                What daily percentage drop qualifies as a statistical shock on NIFTY 50?
              </p>
            </div>
            <div className="text-right font-mono text-sm font-bold text-indigo-400 bg-indigo-950/60 px-3 py-1 rounded-lg border border-indigo-800/60 inline-block self-start sm:self-auto">
              Threshold: {params.fallThresholdPct}%
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {[
              { label: '-1.5% (Moderate Dip)', value: -1.5, desc: 'Frequent (~12x/yr)' },
              { label: '-2.0% (Standard Shock)', value: -2.0, desc: '2.2σ Outlier (~6x/yr)' },
              { label: '-3.0% (Severe Panic)', value: -3.0, desc: 'Capitulation (~2x/yr)' },
              { label: '-4.0% (Black Swan Crash)', value: -4.0, desc: 'Rare Macro Shock' },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setParams(prev => ({ ...prev, fallThresholdPct: opt.value }))}
                className={`p-3 rounded-xl border text-left text-xs transition ${
                  params.fallThresholdPct === opt.value
                    ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-lg ring-1 ring-indigo-500'
                    : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <div className="font-semibold">{opt.label}</div>
                <div className="text-[10px] text-slate-400 mt-1">{opt.desc}</div>
              </button>
            ))}
          </div>

          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-xs text-slate-400 flex items-start space-x-2">
            <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-300">System Rationale:</strong> A daily decline of -2.0% on NIFTY 50 represents an approximate 2.2 standard deviation shock from historical daily mean (+0.05%, stdev 0.92%). It provides sufficient sample size (N &ge; 50 events) without suffering trivial market noise.
            </div>
          </div>
        </div>

        {/* 2. Execution Timing Card */}
        <div className="glass-panel rounded-xl p-5 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-slate-100 text-base">2. Execution Clock & Timing</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${getBadgeStyle(params.entryTiming !== 'same_day_close' ? 'USER_CONFIGURED' : 'SYSTEM_INFERRED')}`}>
                  {getTagLabel(params.entryTiming !== 'same_day_close' ? 'USER_CONFIGURED' : 'SYSTEM_INFERRED')}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                When is the buy order executed after the sharp drop occurs?
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => setParams(prev => ({ ...prev, entryTiming: 'same_day_close' }))}
              className={`p-3.5 rounded-xl border text-left text-xs transition ${
                params.entryTiming === 'same_day_close'
                  ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-lg ring-1 ring-indigo-500'
                  : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              <div className="font-semibold flex items-center justify-between">
                <span>Same-day Market Close (3:20 PM MOC)</span>
                {params.entryTiming === 'same_day_close' && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
              </div>
              <div className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                Buys at the end of the plunge day during the pre-closing auction. Captures overnight bounce if markets open green.
              </div>
            </button>

            <button
              onClick={() => setParams(prev => ({ ...prev, entryTiming: 'next_day_open' }))}
              className={`p-3.5 rounded-xl border text-left text-xs transition ${
                params.entryTiming === 'next_day_open'
                  ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-lg ring-1 ring-indigo-500'
                  : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              <div className="font-semibold flex items-center justify-between">
                <span>Next-day Market Open (9:15 AM MOO)</span>
                {params.entryTiming === 'next_day_open' && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
              </div>
              <div className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                Waits for the morning bell on Day $T+1$. Eliminates same-day closing lookahead bias, but incurs gap-up/gap-down execution variance.
              </div>
            </button>
          </div>
        </div>

        {/* 3. Exit Condition & Holding Horizon */}
        <div className="glass-panel rounded-xl p-5 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-slate-100 text-base">3. Holding Horizon & Exit Rule</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${getBadgeStyle(params.holdingDays !== 5 ? 'USER_CONFIGURED' : 'SYSTEM_INFERRED')}`}>
                  {getTagLabel(params.holdingDays !== 5 ? 'USER_CONFIGURED' : 'SYSTEM_INFERRED')}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                How long should the position be held to capture the mean-reverting bounce?
              </p>
            </div>
            <div className="text-right font-mono text-sm font-bold text-indigo-400 bg-indigo-950/60 px-3 py-1 rounded-lg border border-indigo-800/60 inline-block self-start sm:self-auto">
              Holding: {params.holdingDays} Trading Days
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { days: 1, label: '1 Day (Next Day Flip)' },
              { days: 3, label: '3 Days (Fast Mean Reversion)' },
              { days: 5, label: '5 Days (1 Trading Week)' },
              { days: 10, label: '10 Days (2 Weeks)' },
              { days: 20, label: '20 Days (1 Month)' },
            ].map((h) => (
              <button
                key={h.days}
                onClick={() => setParams(prev => ({ ...prev, holdingDays: h.days }))}
                className={`p-3 rounded-xl border text-left text-xs transition ${
                  params.holdingDays === h.days
                    ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-lg ring-1 ring-indigo-500'
                    : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <div className="font-bold text-sm text-slate-100">{h.days}d</div>
                <div className="text-[10px] text-slate-400 mt-1">{h.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 4. Regime Filter & Real World Frictions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Regime Filter */}
          <div className="glass-panel rounded-xl p-5 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-100 text-sm">4. Trend Regime Filter</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${getBadgeStyle(params.trendFilter !== 'none' ? 'USER_CONFIGURED' : 'SYSTEM_INFERRED')}`}>
                {getTagLabel(params.trendFilter !== 'none' ? 'USER_CONFIGURED' : 'SYSTEM_INFERRED')}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Should we filter out falling knives during structural bear markets?
            </p>
            <div className="space-y-2 pt-1">
              {[
                { id: 'none', label: 'All Regimes (No Filter)', desc: 'Tests all historical dips regardless of market health' },
                { id: 'above_200_sma', label: 'Only Above 200 SMA (Bull Trend Dips)', desc: 'Prevents buying into cascading secular bear markets' },
              ].map((rf) => (
                <button
                  key={rf.id}
                  onClick={() => setParams(prev => ({ ...prev, trendFilter: rf.id as 'none' | 'above_200_sma' | 'below_200_sma' }))}
                  className={`w-full p-2.5 rounded-lg border text-left text-xs transition flex flex-col ${
                    params.trendFilter === rf.id
                      ? 'bg-indigo-600/30 border-indigo-500 text-white'
                      : 'bg-slate-900/40 border-slate-800 text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  <span className="font-medium text-slate-200">{rf.label}</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">{rf.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Frictions & Slippage */}
          <div className="glass-panel rounded-xl p-5 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-100 text-sm">5. Frictions & Slippage Costs</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full border font-medium bg-indigo-500/10 text-indigo-400 border-indigo-500/30">
                System Default
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Deducts realistic exchange turnover fees, STT, and bid-ask slippage per trade.
            </p>
            <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Execution Slippage:</span>
                <span className="font-mono text-indigo-300">{params.slippagePct * 2}% round-trip</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>STT + Exchange Turnover:</span>
                <span className="font-mono text-indigo-300">{params.frictionCostPct}%</span>
              </div>
              <div className="border-t border-slate-800 pt-1.5 flex justify-between font-semibold text-slate-200">
                <span>Total Round-Trip Drag:</span>
                <span className="font-mono text-emerald-400">{(params.slippagePct * 2 + params.frictionCostPct).toFixed(2)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <button
          onClick={onBackToAsk}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Question</span>
        </button>

        <button
          onClick={onProceedToDefine}
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition transform hover:-translate-y-0.5"
        >
          <span>Confirm Assumptions & Formulate Hypothesis</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
