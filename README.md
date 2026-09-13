# AlphaPulse — AI-Native Trading Research Platform

> **AI Full-Stack Developer Intern — Thinking & Building Challenge**  
> An epistemic research engine guiding traders from intuitive questions to rigorous quantitative evidence.  
> **Workflow:** `Question (ASK) → Clarification (CLARIFY) → Hypothesis (DEFINE) → Evidence (TEST) → Epistemic Synthesis (LEARN)`

---

## 🌟 Executive Summary & Core Philosophy

Retail trading inquiries almost always begin with vague, intuitive questions:  
> *"Does buying NIFTY after a sharp fall work?"*

Traditional trading platforms either:
1. Blindly execute an unvalidated backtest with hidden assumptions, or
2. Offer generic AI chatbot commentary without empirical proof.

**AlphaPulse** provides an **AI-native research partner** designed around the scientific method:
1. **Deconstructs Ambiguity:** Exposes every unstated assumption (what is a "sharp fall"? When do you enter? When do you exit?).
2. **Explicit Provenance Matrix:** Clearly distinguishes between `[User Stated]`, `[System Inferred]`, and `[User Configured]` parameters.
3. **Deterministic Backtesting Engine:** Simulates 10+ years of NIFTY 50 daily OHLC data with realistic execution frictions (0.10% round-trip).
4. **P-Hacking Defense:** Generates a 2D Parameter Sensitivity Matrix (Drop % vs Holding Days) to verify that an edge is structurally stable rather than an overfitted anomaly.
5. **Epistemic Discipline:** Strictly distinguishes between **Empirical Facts** (what the data actually shows) and **System Inferences** (causal hypotheses), complete with a **Risk Checklist ("What Could Go Wrong")** and **Interactive Next Hypotheses**.

---

## 🏛️ System Architecture & Monorepo Structure

```
suas/
├── frontend/                  # React 18 + TypeScript + Vite + Tailwind Client
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── index.html
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── components/        # 5-Stage UI components & visualizations
│       ├── engine/            # Client-side quantitative fallbacks
│       ├── data/              # Calibrated NIFTY 50 10-year dataset
│       └── types/             # Shared TypeScript research interfaces
│
├── backend/                   # Node.js / Express + TypeScript Quantitative Research API
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── server.ts          # Express REST API Server (Port 5000)
│       ├── routes/            # /api/research/parse, /api/research/backtest, etc.
│       ├── engine/            # Quantitative Backtest, Sensitivity, Epistemic Engines
│       ├── data/              # 10-Year NIFTY 50 Daily OHLC Series & Samples
│       └── types/             # Research models & API types
│
├── package.json               # Root monorepo scripts (dev, build, start)
├── THINKING_NOTE.md           # Part 1 Thinking Note (2 Pages)
├── AI_USAGE_NOTE.md           # Part 5 AI Usage Note (1 Page)
├── EXPLAIN_YOUR_WORK.md       # Part 4 Presentation Script & Q&A Defenses
├── README.md                  # System Documentation
└── demo_recording.webp        # End-to-End Visual Demo Recording
```

---

## 🚀 Technology Stack & Rationale

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Framework** | **React 18 + TypeScript** | Type-safe state machine managing the 5-stage research pipeline with zero runtime ambiguity. |
| **Build Tool** | **Vite 6** | Ultra-fast HMR and optimized production bundling. |
| **Styling** | **Tailwind CSS + Glassmorphism** | Modern institutional dark theme with custom responsive tokens. |
| **Visualizations** | **Recharts + SVG Heatmaps** | High-performance interactive equity curves, drawdown series, and multi-variable parameter grids. |
| **Icons** | **Lucide React** | Clean, modern iconography for status tags and metrics. |
| **Quant Engine** | **Deterministic Event Simulator** | Client-side execution over 2,600+ calibrated daily NIFTY candles with realistic slippage, STT, and regime filters. |

---

## 📋 Key Assumptions

1. **Asset:** NIFTY 50 Index continuous daily time-series (2014–2024, ~2,600 trading sessions).
2. **Default "Sharp Fall":** Single-day decline $\le -2.0\%$ (representing an approximate $2.2\sigma$ statistical shock).
3. **Execution Clock:** Market-on-Close (3:20 PM MOC) as default, with optional Next-Day Market-on-Open (9:15 AM MOO) to test overnight gap risk.
4. **Exit Strategy:** Fixed 5 trading days (1 calendar week) holding horizon or optional Target (+3%) / Stop (-2%) rules.
5. **Frictions:** 0.10% round-trip drag (0.05% per leg slippage + STT/exchange turnover fees).

---

## 🛠️ How to Run Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Launching the Application
```bash
# 1. Start the Frontend (Vite Client)
npm run dev:frontend
# Access at http://localhost:5173/

# 2. Start the Backend API (Express Server)
npm run dev:backend
# Access at http://localhost:5000/ (Health check at /api/health)

# 3. Build Full Monorepo
npm run build
```

---

## 🤖 AI Tools Used

- **Antigravity AI (Gemini 3.7 / Claude 3.5 Sonnet)**:
  - Assisted in scaffolding TypeScript models, writing Recharts SVG wrappers, and formatting financial formulas.
  - Used as an active thought partner to stress-test epistemic assumptions and identify edge cases (e.g., look-ahead bias, regime dependence).
  - Detailed in [`AI_USAGE_NOTE.md`](file:///d:/suas/AI_USAGE_NOTE.md).

---

## 📈 What I Would Improve With More Time

1. **Intraday Tick-Level & Order Book Simulation:**
   Integrate 1-minute OHLCV data with Level-2 order book depth to model exact bid-ask slippage during panic circuit breaker sessions.
2. **India VIX Volatility Surface Integration:**
   Incorporate historical India VIX implied volatility surfaces to price options hedging strategies alongside equity dip buying.
3. **Monte Carlo Resampling & Bootstrapping:**
   Run 5,000 synthetic Monte Carlo iterations across trade return distributions to generate statistical confidence intervals ($p$-values, Value-at-Risk).
4. **Live Paper Trading Execution Bridge:**
   Connect to Indian broker APIs (Zerodha Kite Connect, Upstox, Dhan) for 1-click execution of verified hypotheses in sandbox accounts.

---

## 📁 Submission Deliverables Index

- 📄 **Thinking Note (Part 1):** [`THINKING_NOTE.md`](file:///d:/suas/THINKING_NOTE.md)
- 📄 **AI Usage Note (Part 5):** [`AI_USAGE_NOTE.md`](file:///d:/suas/AI_USAGE_NOTE.md)
- 💻 **Interactive Prototype:** [Running on `http://localhost:5173/`](http://localhost:5173/)
