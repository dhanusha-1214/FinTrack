import { subDays, subMonths, format } from 'date-fns';

const today = new Date(2024, 6, 31); // July 31 2024

function d(offsetDays) {
  return format(subDays(today, offsetDays), 'yyyy-MM-dd');
}

export const CATEGORIES = [
  'Housing', 'Groceries', 'Transport', 'Entertainment',
  'Health', 'Dining', 'Utilities', 'Shopping', 'Education',
];

export const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Bonus'];

export const ALL_CATEGORIES = [...CATEGORIES, ...INCOME_CATEGORIES];

export const CATEGORY_COLORS = {
  Housing:       { bg: '#1a3a5c', text: '#60a5fa', accent: '#3b82f6' },
  Groceries:     { bg: '#064e3b', text: '#34d399', accent: '#10b981' },
  Transport:     { bg: '#451a03', text: '#fb923c', accent: '#f97316' },
  Entertainment: { bg: '#2e1065', text: '#c084fc', accent: '#a855f7' },
  Health:        { bg: '#4c0519', text: '#fb7185', accent: '#f43f5e' },
  Dining:        { bg: '#431407', text: '#fdba74', accent: '#f97316' },
  Utilities:     { bg: '#1e293b', text: '#94a3b8', accent: '#64748b' },
  Shopping:      { bg: '#312e81', text: '#a5b4fc', accent: '#818cf8' },
  Education:     { bg: '#083344', text: '#67e8f9', accent: '#22d3ee' },
  Salary:        { bg: '#052e16', text: '#4ade80', accent: '#22c55e' },
  Freelance:     { bg: '#064e3b', text: '#6ee7b7', accent: '#34d399' },
  Investment:    { bg: '#1e1b4b', text: '#a5b4fc', accent: '#818cf8' },
  Bonus:         { bg: '#422006', text: '#fcd34d', accent: '#f59e0b' },
};

export const MOCK_TRANSACTIONS = [
  // July 2024
  { id: 1,  desc: 'Monthly Salary',        amount: 6500, cat: 'Salary',        type: 'income',  date: d(0) },
  { id: 2,  desc: 'Rent Payment',           amount: 1800, cat: 'Housing',       type: 'expense', date: d(30) },
  { id: 3,  desc: 'Whole Foods Market',     amount: 214,  cat: 'Groceries',     type: 'expense', date: d(28) },
  { id: 4,  desc: 'Netflix Subscription',   amount: 18,   cat: 'Entertainment', type: 'expense', date: d(25) },
  { id: 5,  desc: 'Uber Rides',             amount: 67,   cat: 'Transport',     type: 'expense', date: d(24) },
  { id: 6,  desc: 'Freelance — UI Project', amount: 1200, cat: 'Freelance',     type: 'income',  date: d(20) },
  { id: 7,  desc: 'Doctor Visit',           amount: 150,  cat: 'Health',        type: 'expense', date: d(18) },
  { id: 8,  desc: 'Dividend Income',        amount: 320,  cat: 'Investment',    type: 'income',  date: d(16) },
  { id: 9,  desc: 'Electric Bill',          amount: 95,   cat: 'Utilities',     type: 'expense', date: d(14) },
  { id: 10, desc: 'Restaurant Dinner',      amount: 87,   cat: 'Dining',        type: 'expense', date: d(12) },
  { id: 11, desc: 'Amazon Shopping',        amount: 143,  cat: 'Shopping',      type: 'expense', date: d(10) },
  { id: 12, desc: 'Online Course',          amount: 49,   cat: 'Education',     type: 'expense', date: d(8) },
  // June 2024
  { id: 13, desc: 'Monthly Salary',         amount: 6500, cat: 'Salary',        type: 'income',  date: d(31) },
  { id: 14, desc: 'Rent Payment',           amount: 1800, cat: 'Housing',       type: 'expense', date: d(60) },
  { id: 15, desc: 'Grocery Run',            amount: 175,  cat: 'Groceries',     type: 'expense', date: d(55) },
  { id: 16, desc: 'Spotify Premium',        amount: 12,   cat: 'Entertainment', type: 'expense', date: d(52) },
  { id: 17, desc: 'Gas Station',            amount: 58,   cat: 'Transport',     type: 'expense', date: d(50) },
  { id: 18, desc: 'Freelance — Logo',       amount: 800,  cat: 'Freelance',     type: 'income',  date: d(46) },
  { id: 19, desc: 'Gym Membership',         amount: 50,   cat: 'Health',        type: 'expense', date: d(42) },
  { id: 20, desc: 'Electricity & Gas',      amount: 88,   cat: 'Utilities',     type: 'expense', date: d(40) },
  { id: 21, desc: 'Sushi Restaurant',       amount: 72,   cat: 'Dining',        type: 'expense', date: d(36) },
  { id: 22, desc: 'New Shoes',              amount: 129,  cat: 'Shopping',      type: 'expense', date: d(33) },
  // May 2024
  { id: 23, desc: 'Monthly Salary',         amount: 6500, cat: 'Salary',        type: 'income',  date: d(62) },
  { id: 24, desc: 'Rent Payment',           amount: 1800, cat: 'Housing',       type: 'expense', date: d(91) },
  { id: 25, desc: 'Supermarket Haul',       amount: 230,  cat: 'Groceries',     type: 'expense', date: d(86) },
  { id: 26, desc: 'Cinema Tickets',         amount: 42,   cat: 'Entertainment', type: 'expense', date: d(82) },
  { id: 27, desc: 'Car Service',            amount: 320,  cat: 'Transport',     type: 'expense', date: d(79) },
  { id: 28, desc: 'Pharmacy',               amount: 65,   cat: 'Health',        type: 'expense', date: d(76) },
  { id: 29, desc: 'Investment Return',      amount: 450,  cat: 'Investment',    type: 'income',  date: d(73) },
  { id: 30, desc: 'Water & Gas Bill',       amount: 110,  cat: 'Utilities',     type: 'expense', date: d(70) },
  { id: 31, desc: 'Spring Wardrobe',        amount: 215,  cat: 'Shopping',      type: 'expense', date: d(67) },
  // April 2024
  { id: 32, desc: 'Monthly Salary',         amount: 6500, cat: 'Salary',        type: 'income',  date: d(93) },
  { id: 33, desc: 'Q2 Bonus',              amount: 1500, cat: 'Bonus',          type: 'income',  date: d(92) },
  { id: 34, desc: 'Rent Payment',           amount: 1800, cat: 'Housing',       type: 'expense', date: d(121) },
  { id: 35, desc: "Trader Joe's",           amount: 190,  cat: 'Groceries',     type: 'expense', date: d(116) },
  { id: 36, desc: 'Freelance — Consulting', amount: 1500, cat: 'Freelance',     type: 'income',  date: d(113) },
  { id: 37, desc: 'Monthly Metro Pass',     amount: 98,   cat: 'Transport',     type: 'expense', date: d(110) },
  { id: 38, desc: 'Udemy Courses',          amount: 35,   cat: 'Education',     type: 'expense', date: d(107) },
  { id: 39, desc: 'Internet Bill',          amount: 75,   cat: 'Utilities',     type: 'expense', date: d(104) },
  // March 2024
  { id: 40, desc: 'Monthly Salary',         amount: 6500, cat: 'Salary',        type: 'income',  date: d(124) },
  { id: 41, desc: 'Rent Payment',           amount: 1800, cat: 'Housing',       type: 'expense', date: d(152) },
  { id: 42, desc: 'Concert Tickets',        amount: 180,  cat: 'Entertainment', type: 'expense', date: d(147) },
  { id: 43, desc: 'Health Insurance',       amount: 280,  cat: 'Health',        type: 'expense', date: d(145) },
  { id: 44, desc: 'Investment Dividends',   amount: 390,  cat: 'Investment',    type: 'income',  date: d(142) },
  { id: 45, desc: 'Grocery Shopping',       amount: 198,  cat: 'Groceries',     type: 'expense', date: d(139) },
  { id: 46, desc: 'Dining Out',             amount: 95,   cat: 'Dining',        type: 'expense', date: d(136) },
  // February 2024
  { id: 47, desc: 'Monthly Salary',         amount: 6500, cat: 'Salary',        type: 'income',  date: d(155) },
  { id: 48, desc: 'Rent Payment',           amount: 1800, cat: 'Housing',       type: 'expense', date: d(183) },
  { id: 49, desc: "Valentine's Dinner",     amount: 145,  cat: 'Dining',        type: 'expense', date: d(168) },
  { id: 50, desc: 'Freelance — UI Work',    amount: 950,  cat: 'Freelance',     type: 'income',  date: d(163) },
  { id: 51, desc: 'Investment Dividend',    amount: 280,  cat: 'Investment',    type: 'income',  date: d(158) },
  { id: 52, desc: 'Gym + Protein Shakes',   amount: 89,   cat: 'Health',        type: 'expense', date: d(156) },
  { id: 53, desc: 'New Laptop Bag',         amount: 79,   cat: 'Shopping',      type: 'expense', date: d(160) },
];
