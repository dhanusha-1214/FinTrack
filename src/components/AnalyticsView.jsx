import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LineChart, Line, Legend,
} from 'recharts';
import { fmtFull } from '../utils/helpers';
import { CATEGORY_COLORS } from '../data/transactions';

const COLORS = ['#60a5fa','#22c55e','#f59e0b','#a78bfa','#f43f5e','#34d399','#fb923c','#94a3b8','#67e8f9'];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--bg3)', border: '1px solid var(--border2)',
      borderRadius: 8, padding: '10px 14px', fontSize: 12,
    }}>
      <div style={{ color: 'var(--text2)', marginBottom: 6, fontWeight: 600 }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ color: p.fill || p.stroke, display: 'flex', gap: 10, justifyContent: 'space-between' }}>
          <span>{p.name || p.dataKey}</span>
          <span style={{ fontFamily: 'var(--mono)' }}>{fmtFull(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsView({ stats }) {
  const { catData, weeklyData, monthlyData } = stats;
  const [activeBar, setActiveBar] = useState(null);
  const total = catData.reduce((a, d) => a + d.value, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="section-header">
        <span className="section-title">Analytics</span>
      </div>

      {/* Category bar chart */}
      <div className="chart-card">
        <div className="chart-header">
          <span className="chart-title">Spending by Category — All Time</span>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={catData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}
            onMouseLeave={() => setActiveBar(null)}>
            <CartesianGrid stroke="var(--bg4)" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: 'var(--text3)', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--text3)', fontSize: 10 }} axisLine={false} tickLine={false}
              tickFormatter={v => '$' + (v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v)} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} onMouseEnter={(_, i) => setActiveBar(i)}>
              {catData.map((d, i) => {
                const col = (CATEGORY_COLORS[d.name] || {}).accent || COLORS[i % COLORS.length];
                return <Cell key={d.name} fill={col} opacity={activeBar === null || activeBar === i ? 1 : 0.4} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Weekly spending */}
        <div className="chart-card">
          <div className="chart-header">
            <span className="chart-title">Weekly Spending</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weeklyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="var(--bg4)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="week" tick={{ fill: 'var(--text3)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text3)', fontSize: 10 }} axisLine={false} tickLine={false}
                tickFormatter={v => '$' + v} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="amount" fill="#a78bfa" radius={[3, 3, 0, 0]} name="Spent" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Income vs Expense line */}
        <div className="chart-card">
          <div className="chart-header">
            <span className="chart-title">Income vs Expense Trend</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={monthlyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="var(--bg4)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: 'var(--text3)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text3)', fontSize: 10 }} axisLine={false} tickLine={false}
                tickFormatter={v => '$' + (v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v)} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2} dot={{ r: 3, fill: '#22c55e' }} name="Income" />
              <Line type="monotone" dataKey="expense" stroke="#f43f5e" strokeWidth={2} dot={{ r: 3, fill: '#f43f5e' }} name="Expenses" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category breakdown table */}
      <div className="txn-card">
        <div className="txn-toolbar">
          <span className="txn-toolbar-title">Category Breakdown</span>
          <span className="txn-count">{catData.length}</span>
        </div>
        <div className="txn-table-wrap">
          <table className="txn-table">
            <thead>
              <tr>
                <th>Category</th>
                <th style={{ textAlign: 'right' }}>Total Spent</th>
                <th style={{ textAlign: 'right' }}>Share</th>
                <th>Distribution</th>
              </tr>
            </thead>
            <tbody>
              {catData.map((d, i) => {
                const cc = CATEGORY_COLORS[d.name] || { bg: '#1e293b', text: '#94a3b8', accent: '#64748b' };
                const pct = Math.round((d.value / total) * 100);
                return (
                  <tr key={d.name}>
                    <td>
                      <span className="cat-badge" style={{ background: cc.bg, color: cc.text }}>{d.name}</span>
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--mono)', fontSize: 13 }}>
                      {fmtFull(d.value)}
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text2)' }}>
                      {pct}%
                    </td>
                    <td style={{ width: 160 }}>
                      <div style={{ height: 4, background: 'var(--bg4)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', borderRadius: 2,
                          width: `${pct}%`, background: cc.accent,
                          transition: 'width 0.5s ease',
                        }} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
