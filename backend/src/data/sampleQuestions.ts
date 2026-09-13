export interface SampleQuestion {
  id: string;
  query: string;
  category: 'Mean Reversion' | 'Momentum' | 'Volatility' | 'Pattern';
  description: string;
  defaultThreshold: number;
  holdingDays: number;
}

export const SAMPLE_QUESTIONS: SampleQuestion[] = [
  {
    id: 'sharp-fall-nifty',
    query: 'Does buying NIFTY after a sharp fall work?',
    category: 'Mean Reversion',
    description: 'The core benchmark inquiry: Testing post-shock bounce probability on the benchmark index.',
    defaultThreshold: -2.0,
    holdingDays: 5
  },
  {
    id: 'consecutive-red-days',
    query: 'Is buying NIFTY after 3 consecutive red days profitable?',
    category: 'Mean Reversion',
    description: 'Multi-day momentum depletion hypothesis testing.',
    defaultThreshold: -3.0,
    holdingDays: 5
  },
  {
    id: 'rsi-oversold-dip',
    query: 'Should I buy NIFTY when RSI dips below 30?',
    category: 'Volatility',
    description: 'Technical oscillator extreme boundary testing.',
    defaultThreshold: -2.5,
    holdingDays: 10
  },
  {
    id: 'covid-style-crash',
    query: 'Does buying massive panic drops (> 3.5%) beat buy-and-hold?',
    category: 'Mean Reversion',
    description: 'Tail-risk capitulation dip buying evaluation.',
    defaultThreshold: -3.5,
    holdingDays: 20
  }
];
