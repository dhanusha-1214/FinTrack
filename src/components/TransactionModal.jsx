import React, { useState, useEffect } from 'react';
import { ALL_CATEGORIES, CATEGORIES, INCOME_CATEGORIES } from '../data/transactions';

const EMPTY = {
  desc: '', amount: '', cat: 'Groceries', type: 'expense',
  date: new Date().toISOString().slice(0, 10),
};

export default function TransactionModal({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setForm(initial ? { ...initial, amount: String(initial.amount) } : EMPTY);
      setErrors({});
    }
  }, [open, initial]);

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: '' }));
  }

  function validate() {
    const e = {};
    if (!form.desc.trim()) e.desc = 'Required';
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) e.amount = 'Enter a valid amount';
    if (!form.date) e.date = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    onSave({ ...form, amount: parseFloat(form.amount) });
    onClose();
  }

  const catOptions = form.type === 'income' ? INCOME_CATEGORIES : CATEGORIES;

  // Fix category when type switches
  function handleTypeChange(val) {
    const cats = val === 'income' ? INCOME_CATEGORIES : CATEGORIES;
    setForm(f => ({ ...f, type: val, cat: cats.includes(f.cat) ? f.cat : cats[0] }));
  }

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{initial ? 'Edit Transaction' : 'Add Transaction'}</div>
          <button className="btn btn-icon" onClick={onClose} style={{ color: 'var(--text2)' }}>✕</button>
        </div>

        <div className="form-row">
          <label className="form-label">Description</label>
          <input
            className="form-input"
            value={form.desc}
            onChange={e => set('desc', e.target.value)}
            placeholder="e.g. Netflix subscription"
            style={errors.desc ? { borderColor: 'var(--red)' } : {}}
          />
          {errors.desc && <div style={{ color: 'var(--red)', fontSize: 11, marginTop: 4 }}>{errors.desc}</div>}
        </div>

        <div className="form-row-2 form-row">
          <div>
            <label className="form-label">Amount ($)</label>
            <input
              className="form-input"
              type="number"
              value={form.amount}
              onChange={e => set('amount', e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              style={errors.amount ? { borderColor: 'var(--red)' } : {}}
            />
            {errors.amount && <div style={{ color: 'var(--red)', fontSize: 11, marginTop: 4 }}>{errors.amount}</div>}
          </div>
          <div>
            <label className="form-label">Date</label>
            <input
              className="form-input"
              type="date"
              value={form.date}
              onChange={e => set('date', e.target.value)}
              style={errors.date ? { borderColor: 'var(--red)' } : {}}
            />
          </div>
        </div>

        <div className="form-row-2 form-row">
          <div>
            <label className="form-label">Type</label>
            <select className="form-input" value={form.type} onChange={e => handleTypeChange(e.target.value)}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div>
            <label className="form-label">Category</label>
            <select className="form-input" value={form.cat} onChange={e => set('cat', e.target.value)}>
              {catOptions.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>
            {initial ? 'Update' : 'Add Transaction'}
          </button>
        </div>
      </div>
    </div>
  );
}
