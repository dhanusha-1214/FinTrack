import React from 'react';
import { fmtFull } from '../utils/helpers';
import { CATEGORY_COLORS } from '../data/transactions';

export default function InsightsPanel({ stats }) {
  const { topCat, cur, prev, avgTxn, savingsRate, expenseRatio } = stats;

  const monthDiff = cur.net - prev.net;
  const topCatColor = topCat ? (CATEGORY_COLORS[topCat[0]] || {}).accent || '#888' : '#888';

  const savingsColor =
    savingsRate > 25 ? 'var(--green)' :
    savingsRate > 10 ? 'var(--amber)' :
    'var(--red)';

  const expColor =
    expenseRatio < 60 ? 'var(--green)' :
    expenseRatio < 80 ? 'var(--amber)' :
    'var(--red)';

  const cards = [
    {
      label: 'Top spending category',
      value: topCat ? topCat[0] : '—',
      sub: topCat ? fmtFull(topCat[1]) + ' total' : 'No data',
      color: topCatColor,
      barPct: topCat ? Math.min(100, Math.round((topCat[1] / (stats.totalExpense || 1)) * 100)) : 0,
      barColor: topCatColor,
    },
    {
      label: 'Month-over-month',
      value: (monthDiff >= 0 ? '+' : '') + fmtFull(monthDiff),
      sub: 'Net change vs last month',
      color: monthDiff >= 0 ? 'var(--green)' : 'var(--red)',
      barPct: Math.min(100, Math.abs(Math.round((monthDiff / (Math.abs(prev.net) || 1)) * 100))),
      barColor: monthDiff >= 0 ? 'var(--green)' : 'var(--red)',
    },
    {
      label: 'Avg transaction',
      value: fmtFull(Math.round(avgTxn)),
      sub: 'Across all transactions',
      color: 'var(--blue)',
      barPct: Math.min(100, Math.round((avgTxn / 1000) * 100)),
      barColor: 'var(--blue)',
    },
    {
      label: 'Savings rate',
      value: Math.round(savingsRate) + '%',
      sub: expenseRatio.toFixed(0) + '% of income spent',
      color: savingsColor,
      barPct: Math.min(100, Math.round(savingsRate)),
      barColor: savingsColor,
    },
  ];

  return (
    <div>
      <div className="section-header">
        <span className="section-title">Insights</span>
      </div>
      <div className="insights-grid">
        {cards.map(card => (
          <div key={card.label} className="insight-card">
            <div className="insight-label">{card.label}</div>
            <div className="insight-value" style={{ color: card.color }}>{card.value}</div>
            <div className="insight-sub">{card.sub}</div>
            <div className="insight-bar">
              <div
                className="insight-bar-fill"
                style={{ width: card.barPct + '%', background: card.barColor }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
