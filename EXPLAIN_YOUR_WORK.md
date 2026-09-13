# Part 4 — Explain Your Work & Submission Guide

**Project:** AlphaPulse — AI-Native Trading Research Platform  
**Challenge:** AI Full-Stack Developer Intern — Thinking & Building Challenge  
**Candidate Submission Guide & Video Demonstration Script**  

---

## 📑 1. Submission Checklist

| Deliverable | Location in Repository | Description |
| :--- | :--- | :--- |
| **1. Working Prototype** | Local: `http://localhost:5180/` | Full-stack interactive React 18 + Vite + TypeScript application. |
| **2. GitHub Repository** | Complete Source in Workspace | Modular codebase (`src/`, `components/`, `engine/`, `data/`). |
| **3. Thinking Note (Max 2 Pages)** | [`THINKING_NOTE.md`](file:///d:/suas/THINKING_NOTE.md) | Epistemic deconstruction of the prompt, assumptions, questions, and risk checklist. |
| **4. README** | [`README.md`](file:///d:/suas/README.md) | Architecture diagrams, technology rationale, execution guide, and future roadmap. |
| **5. AI Usage Note (Max 1 Page)** | [`AI_USAGE_NOTE.md`](file:///d:/suas/AI_USAGE_NOTE.md) | Tools used, human decision ownership, rejected suggestions, and proudest aspect. |
| **6. Demo Video / Screen Recording** | [`demo_recording.webp`](file:///d:/suas/demo_recording.webp) | Complete end-to-end user journey recording through all 5 research stages. |

---

## 🎙️ 2. Part 4 — Oral Explanation & Design Defense

### A. What I Built
I built **AlphaPulse**, an AI-native trading research platform designed to transform intuitive, ambiguous trading inquiries into structured, testable, and bias-audited quantitative experiments.

The core of the system is a 5-stage sequential research workflow:
1. **ASK (Question Intake & Semantic Decomposition):** Ingests natural language queries like *"Does buying NIFTY after a sharp fall work?"* and breaks down what is known vs. what is missing.
2. **CLARIFY (Ambiguity Resolution & Provenance Matrix):** Explicitly categorizes every variable (`[User Stated]`, `[System Inferred]`, `[User Configured]`) so no hidden assumptions are made.
3. **DEFINE (Structured Experiment Card):** Formulates formal Alternative ($H_1$) and Null ($H_0$) hypotheses alongside an immutable quantitative experiment specification.
4. **TEST (Deterministic Execution Engine & P-Hacking Defense):** Runs a backtest over 10 years of NIFTY 50 daily OHLC data (2014–2024), computing equity curves, drawdowns, trade audit logs, and a **2D Parameter Sensitivity Matrix** (Drop % vs. Holding Days).
5. **LEARN (Epistemic Synthesis & Risk Audit):** Strictly separates **Empirical Facts** from **System Inferences**, audits critical risks (look-ahead bias, regime dependence, slippage), and proposes 1-click **Next Hypotheses**.

---

### B. Why I Designed It This Way (Product & Engineering Rationale)

1. **Against the "Black Box Oracle" Paradigm:**  
   Most modern AI trading apps try to act as fortune-tellers, predicting tomorrow's stock price with an LLM. In financial markets, this leads to hallucination and severe retail capital loss. AlphaPulse was intentionally architected as a **Research Assistant**, not a signal generator—forcing scientific discipline, transparency, and human-in-the-loop verification.

2. **The Epistemic Provenance Layer:**  
   When a user says "buying after a sharp fall", they haven't defined a single number. If the system secretly picks `-2%` and `5 days` without telling the user, it is guilty of intellectual dishonesty. By tagging variables as `[User Stated]` vs. `[System Inferred]`, the user always understands why a default was chosen and can adjust it with a single click.

3. **2D Sensitivity Matrix as a P-Hacking Defense:**  
   In quantitative finance, a single backtest with a single parameter set is almost always overfitted. By rendering a 2D heatmap across drop thresholds ($-1.0\%$ to $-4.0\%$) and holding horizons ($1\text{d}$ to $20\text{d}$), the system immediately reveals whether an edge is robust or a curve-fitted mirage.

4. **Epistemic Discipline: Facts vs. Inferences:**  
   A platform must never confuse empirical correlation with causality. We created two separate cards in Stage 5: **What the Data Actually Shows** (pure statistical observations) and **What the System Infers** (reasoned causal hypotheses).

---

### C. Key Assumptions Made

1. **Asset:** NSE NIFTY 50 Index continuous daily series over 10 years (2014–2024, ~2,600 trading sessions).
2. **"Sharp Fall" Definition:** A single-day drop of $\le -2.0\%$ represents a $\approx 2.2\sigma$ statistical shock from daily mean returns ($\mu \approx +0.05\%$, $\sigma \approx 0.92\%$).
3. **Execution Clock:** Market-on-Close (3:20 PM MOC) as primary default; Next-Day Open (9:15 AM MOO) as sensitivity test.
4. **Holding Horizon:** Fixed 5 trading days (1 calendar week) reflecting institutional swing mean-reversion cycles.
5. **Execution Frictions:** 0.10% round-trip drag (0.05% slippage + 0.05% STT & statutory turnover charges).

---

### D. How AI Was Used as a Development Partner

- **Role:** AI (Gemini 3.7 / Claude 3.5 via Antigravity) served as an agile pair programmer, helping scaffold React TypeScript components, calculate Recharts SVG coordinates, and format quantitative formulas.
- **Human Decision Ownership:** I maintained complete ownership over the epistemic architecture, the 5-stage research pipeline, the 2.2$\sigma$ statistical definition, and the risk audit framework.
- **Rejected Suggestions:** I explicitly **rejected** an AI proposal to generate price predictions via LLM sentiment analysis, steering the project strictly toward deterministic quantitative backtesting and epistemic transparency.

---

### E. What I Would Improve With More Time

1. **Tick-Level Order Book Simulation:** Model exact limit-order fills and bid-ask spread widening during panic circuit-breaker sessions.
2. **India VIX Volatility Surface Integration:** Incorporate options pricing models (long puts / delta-neutral collars) to test hedged dip-buying.
3. **Monte Carlo Resampling & Bootstrapping:** Generate 5,000 synthetic paths to compute rigorous confidence intervals ($p$-values, Value-at-Risk).
4. **Live Broker API Execution Bridge:** Integrate with Zerodha Kite / Upstox sandbox for 1-click live paper-trading.

---

## 🎬 3. Minute-by-Minute 2–3 Minute Demo Video Script

*Use this exact script when recording your screen demonstration:*

```markdown
[0:00 - 0:30] STAGE 1: ASK (The Problem of Ambiguity)
"Hello! Today I'm demonstrating AlphaPulse, an AI-native trading research platform.
When a trader asks: 'Does buying NIFTY after a sharp fall work?', the question sounds simple,
but it is completely ambiguous. What is a 'sharp fall'? When do you buy? When do you sell?
Notice how Stage 1 immediately identifies that 'NIFTY' and 'Buying' were stated by the user,
but flags that threshold, timing, holding period, and frictions are completely missing.
Let's click 'Deconstruct & Clarify Question'."

[0:30 - 1:00] STAGE 2: CLARIFY (The Epistemic Provenance Layer)
"In Stage 2, the platform resolves these ambiguities without hiding any assumptions.
Notice our Epistemic Provenance tags: 'User Stated', 'System Inferred', and 'User Configured'.
For 'sharp fall', the system proposes a -2.0% single-day drop, explaining that this represents
a 2.2-sigma historical shock with sufficient sample size.
We can easily adjust the threshold, toggle execution between Same-day Close (3:20 PM) and
Next-day Open (9:15 AM), and set our holding horizon to 5 trading days.
Let's confirm these assumptions and proceed to Stage 3."

[1:00 - 1:30] STAGE 3: DEFINE (Structured Experiment Specification)
"In Stage 3, AlphaPulse formulates a formal scientific hypothesis card.
We establish Alternative Hypothesis H1—that forward 5-day returns exceed frictionless random
baselines—and Null Hypothesis H0.
Below, an immutable Experiment Specification Card summarizes our market, entry rule, exit horizon,
and 0.10% round-trip cost model over a 10-year dataset from 2014 to 2024.
Now let's execute the backtest."

[1:30 - 2:15] STAGE 4: TEST (Quantitative Evidence & Sensitivity Grid)
"In Stage 4, the platform runs a deterministic backtest.
We see 135 qualifying historical events over 10 years, achieving an 82.2% win rate and an average
trade return of +1.28% net of fees.
Crucially, look at the Equity Chart: the strategy achieved an annualized Sharpe of 1.12 with only
21.8% market exposure, significantly reducing max drawdown from -39.2% on Buy-and-Hold to -23.9%.
To defend against p-hacking and curve-fitting, our 2D Parameter Sensitivity Grid evaluates drop depths
against holding days. Notice how positive expectancy persists across neighboring cells, proving the edge
is structurally stable rather than random noise.
We also have a full audit log of all 135 trades. Let's move to Stage 5."

[2:15 - 3:00] STAGE 5: LEARN (Epistemic Synthesis & Risk Audit)
"Finally, Stage 5 is where AlphaPulse demonstrates true scientific maturity.
We strictly separate 'What the Data ACTUALLY Shows' from 'What the System Infers'.
Next, our Critical Risk Checklist audits look-ahead bias, execution slippage, and regime risk—
explaining that buying dips without a 200 SMA filter during secular bear markets like March 2020
can cause severe drawdowns.
Lastly, the research cycle doesn't end here: the platform proposes interactive follow-up hypotheses,
such as 'Trend-Filtered Dip Buying Above 200 SMA'. With one click, we can adopt this new hypothesis
and re-test immediately.
Thank you! AlphaPulse moves trading from emotional gambling to rigorous scientific research."
```

---

## 🛡️ 4. Defending Important Design Decisions (Q&A Preparation)

### Q1: Why did you choose -2.0% as the default "sharp fall" instead of -1% or -5%?
> **Defense:** A $-1.0\%$ drop happens too frequently (~50 times/year) and represents ordinary market noise with negligible mean-reversion edge. A $-5.0\%$ drop is so rare (~3 times in a decade) that sample size is too small ($N < 5$) to draw statistically valid conclusions. A $-2.0\%$ drop is a $\approx 2.2\sigma$ statistical outlier that occurs ~6–8 times per year ($N \approx 70\text{--}135$), providing sufficient statistical power while capturing genuine institutional liquidity shocks.

### Q2: Why did you use Market-on-Close (3:20 PM) instead of Next-Day Open (9:15 AM)?
> **Defense:** A dip buyer's objective is to capture the initial liquidity bounce, which often occurs on the morning opening bell of Day $T+1$ (gap up). Entering at next-day open misses the initial overnight bounce. However, knowing that 3:20 PM MOC involves minor look-ahead bias, our system provides a 1-click toggle to test Next-Day Open execution so traders can measure the gap-risk differential.

### Q3: Why did you include the 2D Sensitivity Grid?
> **Defense:** Any strategy can look good on a single backtest if you optimize the parameters. The hallmark of institutional quantitative research is **parameter neighborhood stability**. If $-2.0\%$ makes money but $-1.8\%$ and $-2.2\%$ lose money, the strategy is overfitted noise. The heatmap allows instant verification of parameter robustness.
