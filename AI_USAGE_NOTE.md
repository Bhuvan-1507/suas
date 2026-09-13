# Part 5 — AI Usage Note: Collaborative Engineering & Decision Ownership

**Project:** AlphaPulse — AI-Native Trading Research Platform  
**Candidate Submission:** AI Full-Stack Developer Intern Challenge  

---

### 1. Which AI tools did you use?
I used **Antigravity AI (powered by advanced reasoning models including Gemini 3.7 and Claude 3.5 Sonnet)** throughout the development process as a pair-programming partner, mathematical modeler, and architecture sounding board.

---

### 2. What did you use them for?
- **Domain Modeling & Boilerplate Acceleration:** Scaffolding the React 18 + TypeScript component hierarchy, Tailwind design tokens, and Recharts visualization components.
- **Statistical Calibration of NIFTY 50 Series:** Writing the deterministic daily time-series generator with accurate historical milestones (2014–2024 election cycles, March 2020 COVID circuit breakers, 2022 rate hike consolidation, June 2024 election flash crash).
- **Backtesting Logic & Sensitivity Calculations:** Implementing the event-driven vector calculation for trade logs, compound equity curves, drawdown series, and 2D parameter heatmaps.

---

### 3. Which important decisions did you make yourself?
1. **The 5-Stage Scientific Architecture (`ASK → CLARIFY → DEFINE → TEST → LEARN`):**
   Instead of building a simplistic backtest dashboard or a generic LLM chatbot, I designed a strict sequential pipeline that forces the user to move through the scientific method before viewing returns.
2. **The Epistemic Clarification Matrix:**
   I mandated that every single parameter in the system must be visibly tagged as `[User Stated]`, `[System Inferred]`, or `[User Configured]`, ensuring zero hidden assumptions.
3. **The Parameter Sensitivity Matrix (P-Hacking Defense):**
   I decided to implement a 2D stability grid (Fall Depth $-1.0\%$ to $-4.0\%$ vs Holding Horizon $1\text{d}$ to $20\text{d}$) because in quantitative trading, single-point backtests are vulnerable to data-mining bias.
4. **Epistemic Division: "Facts" vs "Inferences":**
   I enforced a strict visual separation between empirical historical statistics and qualitative market inferences to avoid misleading retail traders with false certainty.

---

### 4. Did you reject or modify any AI-generated suggestions? Why?
- **Rejected:** The AI initially suggested building an LLM prompt that directly predicted whether tomorrow's market would be up or down using sentiment analysis.
  - *Reason for rejection:* Black-box price predictions are unscientific and unexplainable. The challenge specifically demands a research platform that helps users investigate questions systematically, not a crystal ball.
- **Modified:** The AI generated a basic frictionless backtest returning gross CAGR.
  - *Modification:* I overrode the model to inject realistic exchange frictions (0.10% round-trip slippage, STT, turnover charges) and added the 200-day SMA trend regime filter to expose bear-market falling knife drawdowns.

---

### 5. What part of the solution are you most proud of?
I am most proud of the **Risk Audit ("What Could Go Wrong") and Next-Hypothesis Generator in Stage 5 (Learn)**. It demonstrates true product and quantitative maturity: rather than telling the trader "you found a winning strategy," it teaches them to question look-ahead bias, regime fragility, and sample size limitations, and enables them to seamlessly branch into their next hypothesis with a single click.
