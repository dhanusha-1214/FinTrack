import { MOCK_TRANSACTIONS } from '../data/transactions';

// Simulates network latency
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// Simulates occasional failures for realism
const maybeThrow = (rate = 0.05) => {
  if (Math.random() < rate) throw new Error('Network error — please try again');
};

// GET /api/transactions
export async function fetchTransactions() {
  await delay(600 + Math.random() * 400);
  maybeThrow(0.03);
  return [...MOCK_TRANSACTIONS];
}

// POST /api/transactions
export async function createTransaction(data) {
  await delay(300 + Math.random() * 200);
  maybeThrow(0.05);
  return { ...data, id: Date.now() };
}

// PATCH /api/transactions/:id
export async function patchTransaction(id, updates) {
  await delay(250 + Math.random() * 150);
  maybeThrow(0.05);
  return { id, ...updates };
}

// DELETE /api/transactions/:id
export async function removeTransaction(id) {
  await delay(200 + Math.random() * 100);
  maybeThrow(0.05);
  return { id };
}

// GET /api/budgets
const DEFAULT_BUDGETS = {
  Housing: 2000, Groceries: 300, Transport: 200,
  Entertainment: 150, Dining: 200, Health: 300,
  Utilities: 150, Shopping: 200, Education: 100,
};
export async function fetchBudgets() {
  await delay(300);
  return { ...DEFAULT_BUDGETS };
}
