import React, { useState } from 'react';
import useStore from '../store/useStore';
import { CATEGORY_COLORS, CATEGORIES } from '../data/transactions';

function BudgetBar({ cat, spent, budget, onEdit, isAdmin }) {
  const cc = CATEGORY_COLORS[cat] || { bg: '#1e293b', text: '#94a3b8', accent: '#64748b' };
  const pct = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
  const over = budget > 0 && spent > budget;
  const barColor = over ? 'var(--red)' : pct > 75 ? 'var(--amber)' : cc.accent;
  const remaining = budget - spent;

  return (
    <div style={{
      background: 'var(--bg2)', border: '1px solid var(--border)',
      borderRadius: 10, padding: '14px 16px',
      transition: 'border-color 0.15s',
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border2)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            padding: '2px 8px', borderRadius: 5, fontSize: 11, fontWeight: 500,
            background: cc.bg, color: cc.text,
          }}>{cat}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: over ? 'var(--red)' : 'var(--text2)' }}>
            ${Math.round(spent).toLocaleString()}
          </span>
          <span style={{ color: 'var(--text3)', fontSize: 12 }}>/</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text3)' }}>
            ${budget > 0 ? budget.toLocaleString() : '—'}
          </span>
          {isAdmin && (
            <button
              onClick={() => onEdit(cat, budget)}
              style={{
                background: 'transparent', border: 'none', color: 'var(--text3)',
                cursor: 'pointer', fontSize: 12, padding: '2px 4px', borderRadius: 4,
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text3)'}
            >
              ✎
            </button>
          )}
        </div>
      </div>

      <div style={{ height: 6, background: 'var(--bg4)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 3,
          width: budget > 0 ? `${pct}%` : '0%',
          background: barColor,
          transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)',
        }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
        <span style={{ fontSize: 11, color: 'var(--text3)' }}>
          {budget > 0 ? `${Math.round(pct)}% used` : 'No budget set'}
        </span>
        {budget > 0 && (
          <span style={{ fontSize: 11, color: over ? 'var(--red)' : 'var(--green)', fontWeight: 500 }}>
            {over ? `$${Math.round(Math.abs(remaining)).toLocaleString()} over` : `$${Math.round(remaining).toLocaleString()} left`}
          </span>
        )}
      </div>
    </div>
  );
}

export default function BudgetView({ stats }) {
  const { budgets, setBudget, role } = useStore();
  const { expByCat } = stats;
  const isAdmin = role === 'admin';

  const [editCat, setEditCat] = useState(null);
  const [editVal, setEditVal] = useState('');

  function openEdit(cat, current) {
    setEditCat(cat);
    setEditVal(current > 0 ? String(current) : '');
  }

  function saveEdit() {
    if (editCat && editVal !== '') {
      setBudget(editCat, parseFloat(editVal) || 0);
    }
    setEditCat(null);
    setEditVal('');
  }

  const totalBudget = CATEGORIES.reduce((a, c) => a + (budgets[c] || 0), 0);
  const totalSpent = CATEGORIES.reduce((a, c) => a + (expByCat[c] || 0), 0);
  const overBudget = CATEGORIES.filter(c => budgets[c] > 0 && (expByCat[c] || 0) > budgets[c]);

  return (
    <div>
      <div className="section-header">
        <span className="section-title">Budget Tracker</span>
        <span style={{ fontSize: 11, color: 'var(--text3)' }}>
          {overBudget.length > 0
            ? <span style={{ color: 'var(--red)' }}>⚠ {overBudget.length} over budget</span>
            : <span style={{ color: 'var(--green)' }}>✓ All within budget</span>}
        </span>
      </div>

      {/* Summary row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
        {[
          { label: 'Total Budget', val: '$' + totalBudget.toLocaleString(), color: 'var(--blue)' },
          { label: 'Total Spent', val: '$' + Math.round(totalSpent).toLocaleString(), color: totalSpent > totalBudget ? 'var(--red)' : 'var(--text)' },
          { label: 'Remaining', val: '$' + Math.round(Math.max(0, totalBudget - totalSpent)).toLocaleString(), color: totalSpent > totalBudget ? 'var(--red)' : 'var(--green)' },
        ].map(c => (
          <div key={c.label} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 16px' }}>
            <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>{c.label}</div>
            <div style={{ fontSize: 20, fontFamily: 'var(--mono)', fontWeight: 600, color: c.color }}>{c.val}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
        {CATEGORIES.map(cat => (
          <BudgetBar
            key={cat}
            cat={cat}
            spent={expByCat[cat] || 0}
            budget={budgets[cat] || 0}
            onEdit={openEdit}
            isAdmin={isAdmin}
          />
        ))}
      </div>

      {/* Edit modal */}
      {editCat && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setEditCat(null)}>
          <div className="modal" style={{ width: 300 }}>
            <div className="modal-header">
              <div className="modal-title">Set Budget — {editCat}</div>
              <button className="btn btn-icon" onClick={() => setEditCat(null)}>✕</button>
            </div>
            <div className="form-row">
              <label className="form-label">Monthly Budget ($)</label>
              <input
                className="form-input"
                type="number"
                value={editVal}
                onChange={e => setEditVal(e.target.value)}
                placeholder="e.g. 500"
                autoFocus
                min="0"
                onKeyDown={e => e.key === 'Enter' && saveEdit()}
              />
            </div>
            <div className="modal-actions">
              <button className="btn" onClick={() => setEditCat(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={saveEdit}>Save Budget</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
