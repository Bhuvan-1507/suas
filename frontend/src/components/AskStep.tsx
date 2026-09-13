import React, { useState } from 'react';
import { SAMPLE_QUESTIONS, SampleQuestion } from '../data/sampleQuestions';
import { ParsedQueryDecomposition } from '../engine/nlpParser';
import { Sparkles, ArrowRight, AlertTriangle, CheckCircle2, Search, BrainCircuit } from 'lucide-react';

interface AskStepProps {
  userQuery: string;
  setUserQuery: (query: string) => void;
  parsedQuery: ParsedQueryDecomposition;
  onProceedToClarify: () => void;
}

export const AskStep: React.FC<AskStepProps> = ({
  userQuery,
  setUserQuery,
  parsedQuery,
  onProceedToClarify,
}) => {
  const [inputValue, setInputValue] = useState(userQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setUserQuery(inputValue.trim());
      onProceedToClarify();
    }
  };

  const handleSelectSample = (sample: SampleQuestion) => {
    setInputValue(sample.query);
    setUserQuery(sample.query);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Hero Problem Statement */}
      <div className="text-center space-y-3 pt-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-wide">
          <BrainCircuit className="w-3.5 h-3.5" />
          <span>Stage 1: Question Ingestion & Intent Decomposition</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Transform Intuitive Trading Questions into <br />
          <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent">
            Rigorous Quantitative Experiments
          </span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Retail trading ideas start with intuitive questions. Our AI research engine deconstructs ambiguities, formulates testable hypotheses, runs historical backtests, and audits critical trading risks.
        </p>
      </div>

      {/* Main Search/Ask Box */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 shadow-2xl relative gradient-border-indigo">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-slate-300">
            Enter your trading hypothesis or research question:
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-indigo-400" />
            </div>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setUserQuery(e.target.value);
              }}
              placeholder="e.g. Does buying NIFTY after a sharp fall work?"
              className="block w-full pl-12 pr-4 py-4 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-100 placeholder-slate-500 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-inner transition"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Try common inquiries:</span>
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Deconstruct & Clarify Question</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Sample Question Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-4">
          {SAMPLE_QUESTIONS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelectSample(item)}
              className={`text-left p-3 rounded-xl border text-xs transition flex flex-col justify-between ${
                inputValue === item.query
                  ? 'bg-indigo-950/60 border-indigo-500/50 text-indigo-200'
                  : 'bg-slate-900/40 border-slate-800 text-slate-300 hover:bg-slate-800/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between font-medium text-slate-200">
                <span>"{item.query}"</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  {item.category}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">{item.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Semantic Intent Decomposition Breakdown Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Identified Terms */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>Explicitly Stated by User</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start space-x-2">
              <span className="text-emerald-400">•</span>
              <div>
                <strong className="text-slate-200">Asset:</strong> {parsedQuery.identifiedSubject}
              </div>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-400">•</span>
              <div>
                <strong className="text-slate-200">Action:</strong> Long / Buy Direction
              </div>
            </li>
          </ul>
        </div>

        {/* Missing / Ambiguous Elements */}
        <div className="glass-panel p-5 rounded-xl border border-amber-500/20 bg-amber-950/10 space-y-3">
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>Critical Missing Information ({parsedQuery.ambiguitiesIdentified.length})</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            The question is deliberately ambiguous. It does not define <span className="text-amber-300 font-medium">how steep a drop</span> qualifies as "sharp", <span className="text-amber-300 font-medium">execution timing</span>, <span className="text-amber-300 font-medium">holding duration</span>, or <span className="text-amber-300 font-medium">frictions</span>.
          </p>
        </div>

        {/* System Action */}
        <div className="glass-panel p-5 rounded-xl border border-indigo-500/20 bg-indigo-950/10 space-y-3">
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>System Clarification Protocol</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            In the next step, our platform presents concrete quantitative definitions with transparent defaults, allowing full human-in-the-loop validation before testing.
          </p>
        </div>
      </div>
    </div>
  );
};
