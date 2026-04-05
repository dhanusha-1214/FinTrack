import React from 'react';

function Bone({ w, h = 16, radius = 6 }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: radius,
      background: 'var(--bg4)',
      animation: 'shimmer 1.5s infinite',
    }} />
  );
}

export function KPISkeleton() {
  return (
    <div className="kpi-grid">
      {[0, 1, 2].map(i => (
        <div key={i} className="kpi-card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Bone w="60%" h={11} />
          <Bone w="75%" h={28} radius={6} />
          <Bone w="50%" h={11} />
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="charts-row">
      <div className="chart-card">
        <Bone w="40%" h={12} />
        <div style={{ marginTop: 16 }}>
          <Bone w="100%" h={200} radius={8} />
        </div>
      </div>
      <div className="chart-card">
        <Bone w="40%" h={12} />
        <div style={{ marginTop: 16 }}>
          <Bone w="100%" h={200} radius={8} />
        </div>
      </div>
    </div>
  );
}

export default function LoadingSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <KPISkeleton />
      <ChartSkeleton />
      <style>{`
        @keyframes shimmer {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
