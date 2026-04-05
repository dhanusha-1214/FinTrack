# FinTrack — Finance Dashboard

A clean, interactive personal finance dashboard built as a frontend evaluation project. Track income, expenses, spending trends, and financial insights — all in a responsive dark/light UI.

---

## Live Demo

> Deploy to Vercel: `vercel --prod` (see setup below)

---

## Tech Stack

| Technology | Choice | Why |
|------------|--------|-----|
| Framework | **React 18 + JavaScript** | Component-driven, excellent ecosystem, easy state wiring |
| Styling | **Custom CSS with variables** | Full design control, no class-name bloat, great dark-mode support |
| State | **Zustand + localStorage** | Lightweight, zero boilerplate, built-in persistence |
| Charts | **Recharts** | Composable, React-native, declarative — fits perfectly |
| Fonts | **Syne + DM Mono** | Distinctive and readable for a financial product |

---

## Features

- **Dashboard Overview** — Balance, income and expense KPI cards with month-over-month deltas
- **Trend Chart** — 6-month area chart showing net, income, and expense trends
- **Spending Breakdown** — Donut chart by category with percentage labels
- **Insights Section** — Top spending category, MoM net change, average transaction, savings rate
- **Transactions Table** — Full list with date, description, category, type, and signed amount
- **Search & Filter** — Live text search, category filter, type filter, month filter
- **Sorting** — Click any column header to toggle ascending/descending sort
- **Role-Based UI** — Admin sees Add/Edit/Delete controls; Viewer gets read-only mode
- **Add/Edit Transactions** — Modal form with validation, type-aware category options
- **CSV Export** — Download filtered transactions as a CSV file
- **Dark/Light Mode** — Toggle in the topbar; preference persists via localStorage
- **Data Persistence** — Transactions survive page refresh via Zustand's persist middleware
- **Responsive Design** — Works on mobile, tablet, and desktop
- **Empty States** — Graceful "no results" with clear-filter CTA

---

## Setup

```bash
# Clone the repo
git clone https://github.com/your-username/finance-dashboard.git
cd finance-dashboard

# Install dependencies
npm install

# Start dev server
npm start
# → http://localhost:3000

# Build for production
npm run build
```

### Deploy to Vercel

```bash
npm i -g vercel
vercel --prod
```

Or connect the repo in the [Vercel dashboard](https://vercel.com) — it auto-detects Create React App.

---

## Project Structure

```
src/
├── components/
│   ├── SummaryCards.jsx     # KPI cards (balance, income, expenses)
│   ├── Charts.jsx           # TrendChart + CategoryChart (Recharts)
│   ├── InsightsPanel.jsx    # Computed financial insights
│   ├── TransactionsTable.jsx # Table with filters, sort, RBAC actions
│   └── TransactionModal.jsx # Add/edit form modal
├── data/
│   └── transactions.js      # 53 mock transactions + category config
├── store/
│   └── useStore.js          # Zustand store: state, actions, derived selectors
├── utils/
│   └── helpers.js           # Formatters, CSV export, delta calculation
├── App.jsx                  # Layout shell, topbar, sidebar
├── index.css                # Design system, CSS variables, responsive rules
└── index.js                 # React entry point
```

---

## State Design

All state lives in a single Zustand store with three layers:

1. **Raw state** — `transactions[]`, `role`, `filters`, `sortConfig`, `darkMode`
2. **Actions** — `setRole`, `setFilter`, `addTransaction`, `updateTransaction`, `deleteTransaction`, etc.
3. **Derived selectors** — `getFilteredTransactions()` and `getDerivedStats()` compute everything on-demand from raw transactions; no duplicate state

This means every chart, KPI, and insight is always consistent with the underlying data.

---

## Role-Based UI

Role switching is purely frontend (no auth). Switch via the topbar dropdown:

| Role | Capabilities |
|------|-------------|
| **Admin** | Full read/write — Add, Edit, Delete transactions; Export CSV |
| **Viewer** | Read-only — all data visible, no mutation controls shown |

---

## Technical Decisions & Trade-offs

**Why Zustand over Redux?** Redux adds significant boilerplate for a project this size. Zustand gives us a centralized store, derived selectors, and localStorage persistence in under 80 lines.

**Why custom CSS over Tailwind?** Custom CSS variables give precise control over the design system and dark mode without purging concerns or build complexity. All tokens live in `:root` and `[data-theme="light"]`.

**Why Recharts over Chart.js?** Recharts is component-based and composes naturally in JSX. No imperative `.destroy()` lifecycle management needed.

**Static mock data** — No backend dependency keeps the project focused on frontend architecture. The data shape mirrors what a real API would return.

---

## Known Limitations & Future Improvements

- No backend — data resets if localStorage is cleared
- Role switching is cosmetic (no JWT/session)
- No advanced date range picker (month-level filtering only)
- Charts could support drill-down on click
- Could add budget targets per category
- CSV import would complement the CSV export

---

## Screenshots

> Add screenshots here after deploying — dashboard overview, mobile view, Viewer mode, Add Transaction modal.
