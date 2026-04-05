import React, { useState } from 'react';
import useStore from '../store/useStore';
import { fmtFull } from '../utils/helpers';

function GoalCard({ goal, onContribute, onDelete, isAdmin }) {
  const pct = Math.min((goal.saved / goal.target) * 100, 100);
  const isComplete = pct >= 100;

  return (
    <div className="kpi-card" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <div className="kpi-label">{goal.category || 'Savings Goal'}</div>
          <div className="kpi-value" style={{ fontSize: 22 }}>{goal.name}</div>
        </div>
        {isAdmin && (
          <button className="btn btn-icon btn-danger" onClick={() => onDelete(goal.id)} title="Delete Goal">✕</button>
        )}
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
          <span style={{ color: 'var(--text2)' }}>Progress</span>
          <span style={{ fontWeight: 600, color: isComplete ? 'var(--green)' : 'var(--text)' }}>
            {Math.round(pct)}%
          </span>
        </div>
        <div style={{ height: 8, background: 'var(--bg4)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${pct}%`,
            background: isComplete ? 'var(--grad-green)' : 'var(--grad-blue)',
            borderRadius: 4,
            transition: 'width 1s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }} />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 12, color: 'var(--text3)' }}>
          <span style={{ color: 'var(--text)', fontWeight: 600 }}>{fmtFull(goal.saved)}</span>
          {' of '}
          <span>{fmtFull(goal.target)}</span>
        </div>
        {isAdmin && !isComplete && (
          <button
            className="btn btn-primary"
            style={{ padding: '4px 10px', fontSize: 11 }}
            onClick={() => onContribute(goal.id)}
          >
            + Add Funds
          </button>
        )}
      </div>
      {isComplete && (
        <div style={{ marginTop: 12, fontSize: 11, color: 'var(--green)', fontWeight: 600, textAlign: 'center' }}>
          🎉 Goal Achieved!
        </div>
      )}
    </div>
  );
}

export default function SavingsGoals() {
  const { goals, addGoal, deleteGoal, contributeToGoal, role } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: '', target: '', category: 'General' });
  const isAdmin = role === 'admin';

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newGoal.name || !newGoal.target) return;
    addGoal({ ...newGoal, target: parseFloat(newGoal.target) });
    setNewGoal({ name: '', target: '', category: 'General' });
    setShowAdd(false);
  };

  return (
    <div className="fade-in">
      <div className="section-header">
        <span className="section-title">Savings Goals</span>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
            <span>+</span> New Goal
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {goals.map(goal => (
          <GoalCard
            key={goal.id}
            goal={goal}
            isAdmin={isAdmin}
            onDelete={deleteGoal}
            onContribute={(id) => {
              const amt = prompt('Amount to contribute:');
              if (amt) contributeToGoal(id, parseFloat(amt));
            }}
          />
        ))}

        {goals.length === 0 && !showAdd && (
          <div className="kpi-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🎯</div>
            <div className="empty-title">No savings goals yet</div>
            <div className="empty-sub">Start planning for your future by setting your first goal.</div>
            {isAdmin && (
              <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => setShowAdd(true)}>
                Create a Goal
              </button>
            )}
          </div>
        )}
      </div>

      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <form className="modal" onClick={e => e.stopPropagation()} onSubmit={handleAdd}>
            <div className="modal-header">
              <div className="modal-title">New Savings Goal</div>
              <button type="button" className="btn btn-icon" onClick={() => setShowAdd(false)}>✕</button>
            </div>
            <div className="form-row">
              <label className="form-label">Goal Name</label>
              <input
                className="form-input"
                placeholder="e.g. Dream Vacation"
                value={newGoal.name}
                onChange={e => setNewGoal({ ...newGoal, name: e.target.value })}
                required
                autoFocus
              />
            </div>
            <div className="form-row">
              <label className="form-label">Target Amount ($)</label>
              <input
                className="form-input"
                type="number"
                placeholder="e.g. 5000"
                value={newGoal.target}
                onChange={e => setNewGoal({ ...newGoal, target: e.target.value })}
                required
              />
            </div>
            <div className="form-row">
              <label className="form-label">Category</label>
              <select
                className="form-input"
                value={newGoal.category}
                onChange={e => setNewGoal({ ...newGoal, category: e.target.value })}
              >
                <option>General</option>
                <option>Travel</option>
                <option>Emergency</option>
                <option>Purchase</option>
                <option>Investment</option>
              </select>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn" onClick={() => setShowAdd(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Create Goal</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
