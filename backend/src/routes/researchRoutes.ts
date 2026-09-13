import { Router, Request, Response } from 'express';
import { parseTradingQuery } from '../engine/nlpParser.js';
import { runBacktest } from '../engine/backtestEngine.js';
import { computeSensitivityMatrix } from '../engine/sensitivity.js';
import { generateEpistemicAudit } from '../engine/epistemicAudit.js';
import { getNifty50Data } from '../data/niftyDataEngine.js';
import { SAMPLE_QUESTIONS } from '../data/sampleQuestions.js';

const router = Router();

// 1. NLP Query Parsing & Intent Decomposition
router.post('/parse', (req: Request, res: Response) => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== 'string') {
      res.status(400).json({ error: 'Query string is required' });
      return;
    }
    const parsed = parseTradingQuery(query);
    res.json(parsed);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to parse query' });
  }
});

// 2. Quantitative Backtest Execution
router.post('/backtest', (req: Request, res: Response) => {
  try {
    const { params } = req.body;
    if (!params) {
      res.status(400).json({ error: 'Experiment params are required' });
      return;
    }
    const results = runBacktest(params);
    res.json(results);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to run backtest' });
  }
});

// 3. Multi-Variable Parameter Sensitivity Grid
router.post('/sensitivity', (req: Request, res: Response) => {
  try {
    const { params } = req.body;
    if (!params) {
      res.status(400).json({ error: 'Experiment params are required' });
      return;
    }
    const matrix = computeSensitivityMatrix(params);
    res.json(matrix);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to compute sensitivity matrix' });
  }
});

// 4. Epistemic Audit & Follow-Up Hypotheses
router.post('/audit', (req: Request, res: Response) => {
  try {
    const { params, results } = req.body;
    if (!params || !results) {
      res.status(400).json({ error: 'Both params and results are required' });
      return;
    }
    const audit = generateEpistemicAudit(params, results);
    res.json(audit);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to generate epistemic audit' });
  }
});

// 5. NIFTY 50 Daily Dataset
router.get('/nifty-data', (_req: Request, res: Response) => {
  try {
    const data = getNifty50Data();
    res.json({ totalCandles: data.length, candles: data });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch dataset' });
  }
});

// 6. Preloaded Sample Questions Catalog
router.get('/sample-questions', (_req: Request, res: Response) => {
  res.json(SAMPLE_QUESTIONS);
});

export default router;
