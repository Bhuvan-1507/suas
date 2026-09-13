import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, AreaChart, Area, CartesianGrid } from 'recharts';
import { DrawdownPoint, EquityPoint } from '../types/research';
import { TrendingUp, Activity } from 'lucide-react';

interface EquityChartProps {
  equityCurve: EquityPoint[];
  drawdownCurve: DrawdownPoint[];
}

export const EquityChart: React.FC<EquityChartProps> = ({ equityCurve, drawdownCurve }) => {
  const [activeTab, setActiveTab] = useState<'EQUITY' | 'DRAWDOWN'>('EQUITY');

  // Downsample data points for smooth responsive rendering
  const downsampledEquity = React.useMemo(() => {
    const step = Math.max(1, Math.floor(equityCurve.length / 150));
    return equityCurve.filter((_, idx) => idx % step === 0 || idx === equityCurve.length - 1);
  }, [equityCurve]);

  const downsampledDrawdown = React.useMemo(() => {
    const step = Math.max(1, Math.floor(drawdownCurve.length / 150));
    return drawdownCurve.filter((_, idx) => idx % step === 0 || idx === drawdownCurve.length - 1);
  }, [drawdownCurve]);

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
      {/* Chart Header & View Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            {activeTab === 'EQUITY' ? <TrendingUp className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">
              {activeTab === 'EQUITY' ? 'Cumulative Performance (Initial ₹1,00,000)' : 'Historical Peak-to-Trough Drawdown (%)'}
            </h3>
            <p className="text-[11px] text-slate-400">
              {activeTab === 'EQUITY' ? 'Strategy Equity Growth vs NIFTY 50 Benchmark Buy & Hold' : 'Downside capital impairment during major market cascades'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('EQUITY')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'EQUITY'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Equity Curve
          </button>
          <button
            onClick={() => setActiveTab('DRAWDOWN')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'DRAWDOWN'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Drawdown (%)
          </button>
        </div>
      </div>

      {/* Recharts Container */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'EQUITY' ? (
            <LineChart data={downsampledEquity} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#64748b"
                tick={{ fontSize: 10 }}
                tickFormatter={(val) => val.slice(0, 4)}
                interval="preserveStartEnd"
              />
              <YAxis
                stroke="#64748b"
                tick={{ fontSize: 10 }}
                tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                domain={['auto', 'auto']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '10px',
                  fontSize: '11px',
                  color: '#f8fafc',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)'
                }}
                formatter={(val: any, name: string) => [
                  `₹${Number(val).toLocaleString('en-IN')}`,
                  name === 'strategyValue' ? 'Dip Buying Strategy' : 'NIFTY 50 Buy & Hold'
                ]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: '10px', fontSize: '11px' }}
                formatter={(val) => (val === 'strategyValue' ? 'Dip Strategy (Net of Costs)' : 'NIFTY 50 Benchmark')}
              />
              <Line
                type="monotone"
                dataKey="strategyValue"
                stroke="#6366f1"
                strokeWidth={2.5}
                dot={false}
                name="strategyValue"
              />
              <Line
                type="monotone"
                dataKey="benchmarkValue"
                stroke="#94a3b8"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
                name="benchmarkValue"
              />
            </LineChart>
          ) : (
            <AreaChart data={downsampledDrawdown} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#64748b"
                tick={{ fontSize: 10 }}
                tickFormatter={(val) => val.slice(0, 4)}
                interval="preserveStartEnd"
              />
              <YAxis
                stroke="#64748b"
                tick={{ fontSize: 10 }}
                tickFormatter={(val) => `${val}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '10px',
                  fontSize: '11px',
                  color: '#f8fafc'
                }}
                formatter={(val: any, name: string) => [
                  `${val}%`,
                  name === 'strategyDrawdownPct' ? 'Strategy Drawdown' : 'Benchmark Drawdown'
                ]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: '10px', fontSize: '11px' }}
                formatter={(val) => (val === 'strategyDrawdownPct' ? 'Strategy Drawdown' : 'NIFTY Benchmark Drawdown')}
              />
              <Area
                type="monotone"
                dataKey="benchmarkDrawdownPct"
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.15}
                name="benchmarkDrawdownPct"
              />
              <Area
                type="monotone"
                dataKey="strategyDrawdownPct"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.3}
                name="strategyDrawdownPct"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
