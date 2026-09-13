import React, { useState, useMemo } from 'react';
import { ResearchStage, ExperimentParams } from './types/research';
import { parseTradingQuery } from './engine/nlpParser';
import { runBacktest } from './engine/backtestEngine';
import { computeSensitivityMatrix } from './engine/sensitivity';
import { generateEpistemicAudit } from './engine/epistemicAudit';
import { Header } from './components/Header';
import { AskStep } from './components/AskStep';
import { ClarifyStep } from './components/ClarifyStep';
import { DefineStep } from './components/DefineStep';
import { TestStep } from './components/TestStep';
import { LearnStep } from './components/LearnStep';
import { DocModal } from './components/DocModal';

export const App: React.FC = () => {
  const [currentStage, setCurrentStage] = useState<ResearchStage>('ASK');
  const [userQuery, setUserQuery] = useState<string>('Does buying NIFTY after a sharp fall work?');
  const [docModalOpen, setDocModalOpen] = useState<boolean>(false);
  const [activeDocTab, setActiveDocTab] = useState<'THINKING' | 'AI_USAGE' | 'README'>('THINKING');

  // Semantic query parsing
  const parsedQuery = useMemo(() => {
    return parseTradingQuery(userQuery);
  }, [userQuery]);

  // Working Experiment Parameters
  const [params, setParams] = useState<ExperimentParams>(parsedQuery.defaultParams);

  // Sync params if user selects a different predefined question in AskStep
  const handleSetUserQuery = (newQuery: string) => {
    setUserQuery(newQuery);
    const updated = parseTradingQuery(newQuery);
    setParams(updated.defaultParams);
  };

  // Run Quantitative Backtest Execution
  const backtestResults = useMemo(() => {
    return runBacktest(params);
  }, [params]);

  // Compute 2D Sensitivity Matrix
  const sensitivityMatrix = useMemo(() => {
    return computeSensitivityMatrix(params);
  }, [params]);

  // Generate Epistemic Synthesis & Risk Audit
  const epistemicAudit = useMemo(() => {
    return generateEpistemicAudit(params, backtestResults);
  }, [params, backtestResults]);

  // Handle follow-up hypothesis adoption
  const handleApplyFollowUpHypothesis = (patch: Partial<ExperimentParams>) => {
    setParams(prev => ({ ...prev, ...patch }));
    setCurrentStage('TEST');
  };

  const handleResetExperiment = () => {
    setUserQuery('Does buying NIFTY after a sharp fall work?');
    const updated = parseTradingQuery('Does buying NIFTY after a sharp fall work?');
    setParams(updated.defaultParams);
    setCurrentStage('ASK');
  };

  const handleOpenDocs = (tab: 'THINKING' | 'AI_USAGE' | 'README') => {
    setActiveDocTab(tab);
    setDocModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Platform Header */}
      <Header
        currentStage={currentStage}
        onSelectStage={setCurrentStage}
        onOpenDocs={handleOpenDocs}
        userQuery={userQuery}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {currentStage === 'ASK' && (
          <AskStep
            userQuery={userQuery}
            setUserQuery={handleSetUserQuery}
            parsedQuery={parsedQuery}
            onProceedToClarify={() => setCurrentStage('CLARIFY')}
          />
        )}

        {currentStage === 'CLARIFY' && (
          <ClarifyStep
            userQuery={userQuery}
            parsedQuery={parsedQuery}
            params={params}
            setParams={setParams}
            onProceedToDefine={() => setCurrentStage('DEFINE')}
            onBackToAsk={() => setCurrentStage('ASK')}
          />
        )}

        {currentStage === 'DEFINE' && (
          <DefineStep
            userQuery={userQuery}
            params={params}
            parsedQuery={parsedQuery}
            onRunTest={() => setCurrentStage('TEST')}
            onBackToClarify={() => setCurrentStage('CLARIFY')}
          />
        )}

        {currentStage === 'TEST' && (
          <TestStep
            params={params}
            setParams={setParams}
            results={backtestResults}
            sensitivity={sensitivityMatrix}
            onProceedToLearn={() => setCurrentStage('LEARN')}
            onBackToDefine={() => setCurrentStage('DEFINE')}
          />
        )}

        {currentStage === 'LEARN' && (
          <LearnStep
            userQuery={userQuery}
            params={params}
            results={backtestResults}
            audit={epistemicAudit}
            onApplyFollowUpHypothesis={handleApplyFollowUpHypothesis}
            onResetExperiment={handleResetExperiment}
            onBackToTest={() => setCurrentStage('TEST')}
          />
        )}
      </main>

      {/* Documentation Viewer Modal */}
      <DocModal
        isOpen={docModalOpen}
        tab={activeDocTab}
        onClose={() => setDocModalOpen(false)}
        onSelectTab={setActiveDocTab}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#060910] py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>AlphaPulse AI-Native Trading Research Platform &bull; Thinking & Building Challenge</span>
          <div className="flex items-center space-x-4">
            <button onClick={() => handleOpenDocs('THINKING')} className="hover:text-slate-300">
              Thinking Note (Part 1)
            </button>
            <span>&bull;</span>
            <button onClick={() => handleOpenDocs('AI_USAGE')} className="hover:text-slate-300">
              AI Usage Note (Part 5)
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
