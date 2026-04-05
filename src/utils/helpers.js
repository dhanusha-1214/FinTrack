export function fmt(n) {
  return '$' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export function fmtFull(n) {
  return (n < 0 ? '-$' : '$') + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export function fmtDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

export function monthLabel(monthKey) {
  if (!monthKey) return '';
  const [y, m] = monthKey.split('-');
  const names = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return names[parseInt(m) - 1] + ' ' + y;
}

export function pctDelta(curr, prev) {
  if (!prev || prev === 0) return { pct: 0, up: true };
  const pct = Math.round(((curr - prev) / Math.abs(prev)) * 100);
  return { pct: Math.abs(pct), up: pct >= 0 };
}

export function exportCSV(transactions) {
  const headers = ['Date','Description','Category','Type','Amount'];
  const rows = transactions.map(t =>
    [t.date, `"${t.desc}"`, t.cat, t.type, t.type === 'income' ? t.amount : -t.amount].join(',')
  );
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'transactions.csv'; a.click();
  URL.revokeObjectURL(url);
}

export function exportJSON(transactions) {
  const json = JSON.stringify(transactions, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'transactions.json'; a.click();
  URL.revokeObjectURL(url);
}
