import React, { useState } from 'react';
import useStore from '../store/useStore';
import TransactionModal from './TransactionModal';
import { fmtDate, exportCSV, exportJSON } from '../utils/helpers';
import { CATEGORY_COLORS } from '../data/transactions';

function SortTh({ col, label, current, onSort, align }) {
  const active = current.col === col;
  return (
    <th
      className={active ? 'active' : ''}
      onClick={() => onSort(col)}
      style={{ textAlign: align || 'left' }}
    >
      {label}
      {active && <span className="sort-arrow">{current.dir === 1 ? ' ▲' : ' ▼'}</span>}
    </th>
  );
}

export default function TransactionsTable({ compact }) {
  const {
    filters, setFilter, resetFilters, sortConfig, setSort,
    role, getFilteredTransactions, addTransaction, updateTransaction,
    deleteTransaction, transactions,
  } = useStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const allFiltered = getFilteredTransactions();
  const filtered = compact ? allFiltered.slice(0, 8) : allFiltered;
  const isAdmin = role === 'admin';

  const months = [...new Set(transactions.map(t => t.date.slice(0, 7)))].sort().reverse();
  const monthLabel = m => {
    const [y, mo] = m.split('-');
    return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][parseInt(mo)-1] + ' ' + y;
  };

  const allCats = [...new Set(transactions.map(t => t.cat))].sort();
  const hasActiveFilters = filters.search || filters.category || filters.type ||
    filters.month || filters.amountMin || filters.amountMax;

  function openAdd()    { setEditTarget(null);  setModalOpen(true); }
  function openEdit(t)  { setEditTarget(t);     setModalOpen(true); }

  function handleSave(form) {
    if (editTarget) updateTransaction(editTarget.id, form);
    else            addTransaction(form);
  }

  return (
    <div className="txn-card">
      {/* Toolbar */}
      <div className="txn-toolbar">
        <span className="txn-toolbar-title">Transactions</span>
        <span className="txn-count">{allFiltered.length}</span>

        <input
          className="input-field search-input"
          placeholder="Search…"
          value={filters.search}
          onChange={e => setFilter('search', e.target.value)}
        />

        <select className="input-field" value={filters.category} onChange={e => setFilter('category', e.target.value)}>
          <option value="">All categories</option>
          {allCats.map(c => <option key={c}>{c}</option>)}
        </select>

        <select className="input-field" value={filters.type} onChange={e => setFilter('type', e.target.value)}>
          <option value="">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select className="input-field" value={filters.month} onChange={e => setFilter('month', e.target.value)}>
          <option value="">All months</option>
          {months.map(m => <option key={m} value={m}>{monthLabel(m)}</option>)}
        </select>

        <button
          className={`btn ${showAdvanced ? 'btn-primary' : ''}`}
          style={{ fontSize: 11 }}
          onClick={() => setShowAdvanced(s => !s)}
          title="Amount range filter"
        >
          ⚙ Filters
        </button>

        {hasActiveFilters && (
          <button className="btn" onClick={resetFilters} style={{ color: 'var(--text2)', fontSize: 11 }}>
            ✕ Clear
          </button>
        )}

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          <button className="btn" onClick={() => exportCSV(allFiltered)} title="Export CSV" style={{ fontSize: 11 }}>
            ↓ CSV
          </button>
          <button className="btn" onClick={() => exportJSON(allFiltered)} title="Export JSON" style={{ fontSize: 11 }}>
            ↓ JSON
          </button>
          {isAdmin && (
            <button className="btn btn-primary" onClick={openAdd} style={{ fontSize: 12 }}>
              + Add
            </button>
          )}
        </div>
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div style={{
          padding: '10px 20px 12px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
          background: 'var(--bg3)',
          animation: 'fadeIn 0.15s ease',
        }}>
          <span style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600 }}>AMOUNT RANGE</span>
          <input
            className="input-field"
            type="number"
            placeholder="Min $"
            value={filters.amountMin}
            onChange={e => setFilter('amountMin', e.target.value)}
            style={{ width: 100 }}
            min="0"
          />
          <span style={{ color: 'var(--text3)', fontSize: 12 }}>—</span>
          <input
            className="input-field"
            type="number"
            placeholder="Max $"
            value={filters.amountMax}
            onChange={e => setFilter('amountMax', e.target.value)}
            style={{ width: 100 }}
            min="0"
          />
          <span style={{ fontSize: 11, color: 'var(--text3)', marginLeft: 8 }}>
            Showing {allFiltered.length} of {transactions.length} transactions
          </span>
        </div>
      )}

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">⊘</div>
          <div className="empty-title">No transactions found</div>
          <div className="empty-sub">Try adjusting your filters</div>
          {hasActiveFilters && (
            <button className="btn" style={{ marginTop: 12 }} onClick={resetFilters}>
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="txn-table-wrap">
          <table className="txn-table">
            <thead>
              <tr>
                <SortTh col="date"   label="Date"        current={sortConfig} onSort={setSort} />
                <SortTh col="desc"   label="Description" current={sortConfig} onSort={setSort} />
                <SortTh col="cat"    label="Category"    current={sortConfig} onSort={setSort} />
                <SortTh col="type"   label="Type"        current={sortConfig} onSort={setSort} />
                <SortTh col="amount" label="Amount"      current={sortConfig} onSort={setSort} align="right" />
                {isAdmin && <th style={{ textAlign: 'center' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map(txn => {
                const cc = CATEGORY_COLORS[txn.cat] || { bg: '#1e293b', text: '#94a3b8' };
                return (
                  <tr key={txn.id}>
                    <td style={{ color: 'var(--text2)', fontFamily: 'var(--mono)', fontSize: 12, whiteSpace: 'nowrap' }}>
                      {fmtDate(txn.date)}
                    </td>
                    <td style={{ fontWeight: 500 }}>{txn.desc}</td>
                    <td>
                      <span className="cat-badge" style={{ background: cc.bg, color: cc.text }}>{txn.cat}</span>
                    </td>
                    <td>
                      <span className={`type-badge type-${txn.type}`}>{txn.type}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className={txn.type === 'income' ? 'amount-positive' : 'amount-negative'}>
                        {txn.type === 'income' ? '+' : '-'}$
                        {txn.amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </span>
                    </td>
                    {isAdmin && (
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                          <button
                            className="btn"
                            style={{ padding: '4px 10px', fontSize: 11 }}
                            onClick={() => openEdit(txn)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger"
                            style={{ padding: '4px 10px', fontSize: 11 }}
                            onClick={() => deleteTransaction(txn.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <TransactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initial={editTarget}
      />
    </div>
  );
}
