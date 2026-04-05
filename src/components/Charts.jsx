import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip as PieTooltip,
} from 'recharts';
import { fmtFull } from '../utils/helpers';
import { CATEGORY_COLORS } from '../data/transactions';

const COLORS = [
  '#60a5fa','#22c55e','#f59e0b','#a78bfa','#f43f5e',
  '#34d399','#fb923c','#94a3b8','#67e8f9','#fcd34d',
];

function TrendTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--bg3)', border: '1px solid var(--border2)',
      borderRadius: 8, padding: '10px 14px', fontSize: 12,
    }}>
      <div style={{ color: 'var(--text2)', marginBottom: 6, fontWeight: 600 }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ color: p.color, display: 'flex', gap: 10, justifyContent: 'space-between' }}>
          <span>{p.name}</span>
          <span style={{ fontFamily: 'var(--mono)', fontWeight: 500 }}>{fmtFull(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

function CatTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0].payload;
  return (
    <div style={{
      background: 'var(--bg3)', border: '1px solid var(--border2)',
      borderRadius: 8, padding: '8px 12px', fontSize: 12,
    }}>
      <div style={{ color: 'var(--text)', fontWeight: 500 }}>{name}</div>
      <div style={{ color: 'var(--green)', fontFamily: 'var(--mono)' }}>{fmtFull(value)}</div>
    </div>
  );
}

export function TrendChart({ data }) {
  return (
    <div className="chart-card">
      <div className="chart-header">
        <span className="chart-title">Balance Trend — 6 Months</span>
      </div>
      <div className="chart-legend">
        {[
          { color: '#60a5fa', label: 'Net' },
          { color: '#22c55e', label: 'Income' },
          { color: '#f43f5e', label: 'Expenses' },
        ].map(l => (
          <span key={l.label} className="legend-item">
            <span className="legend-dot" style={{ background: l.color }} />
            {l.label}
          </span>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="gradNet" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#60a5fa" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradInc" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--bg4)" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: 'var(--text3)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: 'var(--text3)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => '$' + (Math.abs(v) >= 1000 ? (v/1000).toFixed(0)+'k' : v)} />
          <Tooltip content={<TrendTooltip />} />
          <Area type="monotone" dataKey="income"  stroke="#22c55e" fill="url(#gradInc)" strokeWidth={1.5} strokeDasharray="4 3" dot={false} name="Income" />
          <Area type="monotone" dataKey="expense" stroke="#f43f5e" fill="none" strokeWidth={1.5} strokeDasharray="4 3" dot={false} name="Expenses" />
          <Area type="monotone" dataKey="net"     stroke="#60a5fa" fill="url(#gradNet)" strokeWidth={2} dot={{ fill: '#60a5fa', r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} name="Net" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryChart({ data }) {
  const total = data.reduce((a, d) => a + d.value, 0);
  const top5 = data.slice(0, 5);

  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, index }) => {
    if (index > 4) return null;
    const RADIAN = Math.PI / 180;
    const r = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + r * Math.cos(-midAngle * RADIAN);
    const y = cy + r * Math.sin(-midAngle * RADIAN);
    const pct = Math.round((data[index].value / total) * 100);
    if (pct < 8) return null;
    return <text x={x} y={y} fill="#000" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={600}>{pct}%</text>;
  };

  return (
    <div className="chart-card">
      <div className="chart-header">
        <span className="chart-title">Spending by Category</span>
      </div>
      <div className="chart-legend" style={{ marginBottom: 8 }}>
        {top5.map((d, i) => {
          const col = (CATEGORY_COLORS[d.name] || {}).accent || COLORS[i];
          return (
            <span key={d.name} className="legend-item">
              <span className="legend-dot" style={{ background: col, borderRadius: 3 }} />
              {d.name} ({Math.round(d.value / total * 100)}%)
            </span>
          );
        })}
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            cx="50%" cy="50%"
            innerRadius={52} outerRadius={82}
            paddingAngle={2}
            dataKey="value"
            labelLine={false}
            label={renderLabel}
          >
            {data.map((d, i) => {
              const col = (CATEGORY_COLORS[d.name] || {}).accent || COLORS[i % COLORS.length];
              return <Cell key={d.name} fill={col} stroke="var(--bg2)" strokeWidth={2} />;
            })}
          </Pie>
          <PieTooltip content={<CatTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
