import { X, BookOpen, Sparkles } from 'lucide-react';

interface DocModalProps {
  isOpen: boolean;
  tab: 'THINKING' | 'AI_USAGE' | 'README';
  onClose: () => void;
  onSelectTab: (tab: 'THINKING' | 'AI_USAGE' | 'README') => void;
}

export const DocModal: React.FC<DocModalProps> = ({ isOpen, tab, onClose, onSelectTab }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0f172a] border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:px-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1 bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs font-medium">
              <button
                onClick={() => onSelectTab('THINKING')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition ${
                  tab === 'THINKING' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Thinking Note (Part 1)</span>
              </button>
              <button
                onClick={() => onSelectTab('AI_USAGE')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition ${
                  tab === 'AI_USAGE' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Usage Note (Part 5)</span>
              </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body with formatted content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
          {tab === 'THINKING' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                  Deliverable Part 1 — Thinking Note
                </span>
                <h2 className="text-xl font-bold text-white mt-1">
                  Trading Research Epistemology: Deconstructing "Does buying NIFTY after a sharp fall work?"
                </h2>
              </div>

              {/* Section 1 */}
              <div className="space-y-2">
                <h3 className="text-base font-bold text-indigo-300">
                  1. How would you interpret the question?
                </h3>
                <p>
                  <strong>What does "sharp fall" mean?</strong> In quantitative finance, words like "sharp" are non-operational adjectives. To test this systematically, "sharp fall" must be anchored to statistical distribution properties of NIFTY 50 daily returns ($\mu \approx +0.05\%$, $\sigma \approx 0.92\%$):
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-300">
                  <li><strong>Single-Day Percentage Drop:</strong> A 1-day decline $\le -2.0\%$ represents a $\approx 2.2\sigma$ tail event (~6 occurrences/year). A drop $\le -3.0\%$ represents a $\approx 3.3\sigma$ capitulation event (~2 occurrences/year).</li>
                  <li><strong>Multi-Day Momentum Cascade:</strong> A 3-day cumulative decline $\ge -4.0\%$ or 3 consecutive down closes.</li>
                  <li><strong>Statistical / Volatility Shock:</strong> Daily close piercing the Lower Bollinger Band ($2\sigma$ below 20-day EMA) or RSI(14) dipping below 30.</li>
                </ul>
                <p>
                  <strong>What information is needed before testing?</strong> (a) Precise execution timestamp (3:20 PM close vs 9:15 AM open), (b) Specific holding horizon (e.g. 5 days) or exit rules (Take-Profit/Stop-Loss), (c) Execution frictions (STT, exchange turnover, bid-ask spread slippage), and (d) Regime conditioning (bull trend vs structural bear market).
                </p>
              </div>

              {/* Section 2 */}
              <div className="space-y-2">
                <h3 className="text-base font-bold text-indigo-300">
                  2. What assumptions would you make?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-slate-900 border border-emerald-500/30">
                    <span className="font-bold text-emerald-400 text-xs">What the user actually said:</span>
                    <p className="mt-1 text-[11px] text-slate-300">Asset is NIFTY 50; Direction is Long (buying); Phenomenon is a "sharp fall".</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-indigo-500/30">
                    <span className="font-bold text-indigo-400 text-xs">What we assumed & why:</span>
                    <p className="mt-1 text-[11px] text-slate-300">Single-day drop $\le -2\%$; 5-day holding horizon; Market-on-Close entry; 0.10% round-trip friction.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-cyan-500/30">
                    <span className="font-bold text-cyan-400 text-xs">What the system asks the user:</span>
                    <p className="mt-1 text-[11px] text-slate-300">Threshold slider, MOC vs MOO toggle, holding days (1-20d), 200-SMA trend filter.</p>
                  </div>
                </div>
              </div>

              {/* Section 3 */}
              <div className="space-y-2">
                <h3 className="text-base font-bold text-indigo-300">
                  3. What would you ask the user? (Minimum Critical Questions)
                </h3>
                <ol className="list-decimal pl-5 space-y-1 text-slate-300">
                  <li><strong>Threshold Precision:</strong> "Do you consider a -1.5% intraday dip or a -3.0% panic crash as your trigger?"</li>
                  <li><strong>Execution Clock:</strong> "Will you buy before the market closes at 3:20 PM or wait for the next morning's 9:15 AM opening tick?"</li>
                  <li><strong>Exit Logic:</strong> "How long do you intend to hold? (e.g. 5 days, or exit on a +3% bounce / -2% cut loss)?"</li>
                  <li><strong>Regime Filter:</strong> "Do you want to buy every dip, or only when the broader market is in an established bull trend (above 200 SMA)?"</li>
                </ol>
              </div>

              {/* Section 4 */}
              <div className="space-y-2">
                <h3 className="text-base font-bold text-indigo-300">
                  4. What would the experiment look like?
                </h3>
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 font-mono text-[11px] space-y-1 text-slate-300">
                  <div><strong>Market:</strong> NIFTY 50 Benchmark Index</div>
                  <div><strong>Entry Condition:</strong> Daily Close-to-Close return $\le -2.0\%$</div>
                  <div><strong>Execution Clock:</strong> Market-on-Close (3:20 PM auction)</div>
                  <div><strong>Exit Condition:</strong> Fixed 5 trading days at Close</div>
                  <div><strong>Test Dataset:</strong> 10 Years (2014-2024, ~2,600 daily sessions)</div>
                  <div><strong>Cost Model:</strong> 0.10% round-trip (0.05% slippage + 0.05% STT & fees)</div>
                  <div><strong>Statistical Baseline:</strong> Unconditional forward 5-day random distribution</div>
                </div>
              </div>

              {/* Section 5 */}
              <div className="space-y-2">
                <h3 className="text-base font-bold text-indigo-300">
                  5. What could go wrong? (Critical Risk Audit)
                </h3>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                  <li><strong>Look-Ahead Bias:</strong> Entering at same-day Close assumes the daily return is known before execution occurs.</li>
                  <li><strong>Regime & Falling Knife Risk:</strong> In structural bear markets (March 2020), sharp falls cascade into further sharp falls. Unfiltered dip buying suffers catastrophic left-tail drawdowns.</li>
                  <li><strong>Slippage & Execution Gap:</strong> Panic days exhibit severe order book gaps; entering at next open frequently suffers adverse price jumps.</li>
                  <li><strong>Overfitting / Low N:</strong> Extreme drops ($\le -3\%$) only occur ~20 times in a decade. Parameter mining creates the illusion of alpha through curve-fitting.</li>
                </ul>
              </div>
            </div>
          )}

          {tab === 'AI_USAGE' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                  Deliverable Part 5 — AI Usage Note
                </span>
                <h2 className="text-xl font-bold text-white mt-1">
                  How AI was Utilized as a Scientific Development Partner
                </h2>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <h4 className="font-bold text-white text-xs">1. Which AI tools did you use?</h4>
                  <p className="text-xs text-slate-300">Antigravity AI (Gemini 3.7 / Claude 3.5 architecture) as a pair-programming and quantitative ideation collaborator.</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <h4 className="font-bold text-white text-xs">2. What did you use them for?</h4>
                  <p className="text-xs text-slate-300">Scaffolding the TypeScript state pipeline, generating calibrated historical NIFTY price series formulas, writing Recharts charting bindings, and generating sensitivity matrix grid computations.</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <h4 className="font-bold text-white text-xs">3. Which important decisions did you make yourself?</h4>
                  <p className="text-xs text-slate-300">
                    (a) Designed the 5-stage epistemic user journey (ASK &rarr; CLARIFY &rarr; DEFINE &rarr; TEST &rarr; LEARN), (b) Established the explicit separation between "Empirical Facts" vs "System Inferences", (c) Chose the 2.2&sigma; statistical definition for -2% NIFTY drops, and (d) Designed the 2D Parameter Sensitivity Matrix to prevent p-hacking.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <h4 className="font-bold text-white text-xs">4. Did you reject or modify any AI-generated suggestions? Why?</h4>
                  <p className="text-xs text-slate-300">
                    Yes. The initial AI suggestion was to build a black-box machine learning signal generator that predicted whether tomorrow would be green. I firmly <strong>rejected</strong> this because the core challenge is not predicting stock prices, but creating an honest, transparent research pipeline that exposes assumptions and separates facts from causal beliefs.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <h4 className="font-bold text-white text-xs">5. What part of the solution are you most proud of?</h4>
                  <p className="text-xs text-slate-300">
                    The <strong>Epistemic Clarification Matrix</strong> and the <strong>Parameter Sensitivity Heatmap</strong>. Instead of giving users a naive "Yes, dip buying works with 65% win rate!", the system transparently demonstrates that alpha disappears in bear regimes and depends heavily on holding horizons.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition"
          >
            Close Note
          </button>
        </div>
      </div>
    </div>
  );
};
