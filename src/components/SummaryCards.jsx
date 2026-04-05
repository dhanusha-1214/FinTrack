import React from 'react';
import { useCountUp } from '../hooks/useCountUp';
import { pctDelta } from '../utils/helpers';

function AnimatedAmount({ value, color }) {
  const animated = useCountUp(Math.abs(value));
  const isNeg = value < 0;
  return (
    <div className={`kpi-value ${color}`}>
      {isNeg ? '-' : ''}${animated.toLocaleString()}
    </div>
  );
}

function Delta({ curr, prev, invert }) {
  if (!prev) return <span style={{ color: 'var(--text3)' }}>—</span>;
  const { pct, up } = pctDelta(curr, prev);
  const isGood = invert ? !up : up;
  return (
    <span className={isGood ? 'delta-up' : 'delta-down'}>
      {up ? '↑' : '↓'} {pct}%
    </span>
  );
}

export default function SummaryCards({ stats }) {
  const { balance, cur, prev } = stats;
  return (
    <div className="kpi-grid">
      <div className="kpi-card blue" style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', backdropFilter: 'blur(8px)' }}>
        <div className="kpi-label">Total Balance</div>
        <AnimatedAmount value={balance} color="blue" />
        <div className="kpi-delta">
          <Delta curr={cur.net} prev={prev.net} />
          <span style={{ fontSize: 10, color: 'var(--text3)' }}>net change</span>
        </div>
      </div>
      <div className="kpi-card green" style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', backdropFilter: 'blur(8px)' }}>
        <div className="kpi-label">Monthly Income</div>
        <AnimatedAmount value={cur.income} color="green" />
        <div className="kpi-delta">
          <Delta curr={cur.income} prev={prev.income} />
          <span style={{ fontSize: 10, color: 'var(--text3)' }}>vs last month</span>
        </div>
      </div>
      <div className="kpi-card red" style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', backdropFilter: 'blur(8px)' }}>
        <div className="kpi-label">Monthly Expenses</div>
        <AnimatedAmount value={cur.expense} color="red" />
        <div className="kpi-delta">
          <Delta curr={cur.expense} prev={prev.expense} invert />
          <span style={{ fontSize: 10, color: 'var(--text3)' }}>vs last month</span>
        </div>
      </div>
    </div>
  );
}
