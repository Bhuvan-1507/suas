import React from 'react';
import { ExperimentParams } from '../types/research';
import { EpistemicEvaluation } from '../engine/epistemicAudit';
import { Lightbulb, ArrowLeft, RotateCcw, AlertTriangle, CheckCircle2, ArrowRight, Sparkles, Compass } from 'lucide-react';

interface LearnStepProps {
  userQuery?: string;
  params?: ExperimentParams;
  results?: any;
  audit: EpistemicEvaluation;
  onApplyFollowUpHypothesis: (patch: Partial<ExperimentParams>) => void;
  onResetExperiment: () => void;
  onBackToTest: () => void;
}

export const LearnStep: React.FC<LearnStepProps> = ({
  audit,
  onApplyFollowUpHypothesis,
  onResetExperiment,
  onBackToTest,
}) => {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold tracking-wide">
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Stage 5: Epistemic Synthesis, Risk Audit & Iteration</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Research Synthesis & Epistemic Audit
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Distinguishing empirical observation from subjective inference, auditing real-world execution risks, and proposing next scientific investigations.
            </p>
          </div>
          <button
            onClick={onResetExperiment}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition"
          >
            <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
            <span>New Research Question</span>
          </button>
        </div>
      </div>

      {/* Epistemic Split: Facts vs Inferences Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Box A: What the Data ACTUALLY Shows (Empirical Facts) */}
        <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/10 space-y-4 relative overflow-hidden">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-emerald-300">
                1. What the Data ACTUALLY Shows
              </h3>
              <p className="text-[11px] text-slate-400">Strict empirical observations from 10-year historical backtest</p>
            </div>
          </div>

          <ul className="space-y-3 text-xs text-slate-200">
            {audit.empiricalFacts.map((fact, idx) => (
              <li key={idx} className="flex items-start space-x-2.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 text-[10px] font-bold">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{fact}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Box B: What We Can Reasonably Conclude / What the System Believes */}
        <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 bg-indigo-950/10 space-y-4 relative overflow-hidden">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-indigo-300">
                2. What the System Infers & Believes
              </h3>
              <p className="text-[11px] text-slate-400">Reasoned hypotheses, nuance, and qualitative market mechanics</p>
            </div>
          </div>

          <ul className="space-y-3 text-xs text-slate-200">
            {audit.systemInferences.map((inf, idx) => (
              <li key={idx} className="flex items-start space-x-2.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 text-[10px] font-bold">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{inf}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Critical Risk Audit: "What Could Go Wrong?" */}
      <div className="glass-panel p-6 rounded-2xl border border-rose-500/20 bg-rose-950/5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-rose-300">
                3. Critical Risk Checklist ("What Could Go Wrong?")
              </h3>
              <p className="text-[11px] text-slate-400">
                Known biases, execution traps, regime vulnerability, and statistical limitations
              </p>
            </div>
          </div>
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold uppercase">
            Risk Assessment
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {audit.riskAudit.map((risk) => (
            <div key={risk.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-slate-200">{risk.title}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                  risk.severity === 'CRITICAL'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : risk.severity === 'HIGH'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                }`}>
                  {risk.severity} SEVERITY
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-slate-400 font-medium">Finding:</strong> {risk.finding}
              </p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                <strong className="text-slate-500 font-medium">Historical Evidence:</strong> {risk.evidence}
              </p>
              <div className="pt-1 text-[11px] text-emerald-400 bg-emerald-950/20 p-2 rounded-lg border border-emerald-900/40">
                <strong className="font-semibold">Recommended Fix:</strong> {risk.recommendedMitigation}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Investigation Loop (Interactive Next Hypotheses) */}
      <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 bg-indigo-950/10 space-y-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-indigo-300">
              4. What Should We Investigate Next? (Next Hypotheses)
            </h3>
            <p className="text-[11px] text-slate-400">
              The scientific research cycle continues. Click any proposal below to mutate the experiment parameters and re-test instantly.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {audit.followUpHypotheses.map((hypo) => (
            <div
              key={hypo.id}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 transition flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-100">{hypo.title}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {hypo.badge}
                  </span>
                </div>
                <p className="text-xs text-indigo-200/90 font-medium mt-1.5 leading-relaxed">
                  "{hypo.hypothesis}"
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  {hypo.rationale}
                </p>
              </div>

              <button
                onClick={() => onApplyFollowUpHypothesis(hypo.patch)}
                className="w-full py-2 px-3 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white text-xs font-semibold border border-indigo-500/40 transition flex items-center justify-center space-x-1.5 mt-2"
              >
                <span>Adopt Hypothesis & Re-Test</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <button
          onClick={onBackToTest}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Backtest Evidence</span>
        </button>

        <button
          onClick={onResetExperiment}
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Start Another Research Loop</span>
        </button>
      </div>
    </div>
  );
};
