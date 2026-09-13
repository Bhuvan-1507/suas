import React from 'react';
import { ResearchStage } from '../types/research';
import { HelpCircle, Sparkles, Sliders, FileSpreadsheet, PlayCircle, Lightbulb, BookOpen } from 'lucide-react';

interface HeaderProps {
  currentStage: ResearchStage;
  onSelectStage: (stage: ResearchStage) => void;
  onOpenDocs: (tab: 'THINKING' | 'AI_USAGE' | 'README') => void;
  userQuery?: string;
}

const STAGES: { key: ResearchStage; label: string; icon: React.ComponentType<{ className?: string }>; description: string }[] = [
  { key: 'ASK', label: '1. Ask', icon: HelpCircle, description: 'Natural Question' },
  { key: 'CLARIFY', label: '2. Clarify', icon: Sliders, description: 'Ambiguity & Assumptions' },
  { key: 'DEFINE', label: '3. Define', icon: FileSpreadsheet, description: 'Formal Hypothesis' },
  { key: 'TEST', label: '4. Test', icon: PlayCircle, description: 'Backtest & Evidence' },
  { key: 'LEARN', label: '5. Learn', icon: Lightbulb, description: 'Facts vs Inference & Next' },
];

export const Header: React.FC<HeaderProps> = ({ currentStage, onSelectStage, onOpenDocs }) => {
  const currentStageIndex = STAGES.findIndex(s => s.key === currentStage);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#080c14]/90 backdrop-blur-md">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  AlphaPulse
                </span>
                <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  AI Research Engine
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Question → Hypothesis → Experiment → Evidence → Learning
              </p>
            </div>
          </div>

          {/* Research Notes & Documentation Modals Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onOpenDocs('THINKING')}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-700/80 rounded-lg border border-slate-700/60 transition shadow-sm"
              title="View Part 1 Thinking Note"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden md:inline">Thinking Note</span>
            </button>
            <button
              onClick={() => onOpenDocs('AI_USAGE')}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-700/80 rounded-lg border border-slate-700/60 transition shadow-sm"
              title="View Part 5 AI Usage Note"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">AI Usage Note</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5-Stage Scientific Research Stepper Bar */}
      <div className="border-t border-slate-800/50 bg-[#0a0f1d]/70 px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <nav className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-1 scrollbar-none w-full justify-between">
            {STAGES.map((stage, idx) => {
              const isActive = stage.key === currentStage;
              const isPast = idx < currentStageIndex;
              const Icon = stage.icon;

              return (
                <button
                  key={stage.key}
                  onClick={() => onSelectStage(stage.key)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-400/30'
                      : isPast
                      ? 'bg-slate-800/80 text-emerald-400 hover:bg-slate-700/80 border border-slate-700/50'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <div className={`w-4 h-4 flex items-center justify-center rounded-full ${
                    isActive ? 'text-white' : isPast ? 'text-emerald-400' : 'text-slate-400'
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span>{stage.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
