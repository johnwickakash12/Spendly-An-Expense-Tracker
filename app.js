/* ────────────────────────────────
   STATE
──────────────────────────────── */
let txType = 'expense';
let transactions = JSON.parse(localStorage.getItem('spendly_tx') || '[]');

const CATS = {
  Food:          { color: '#ff6b6b', emoji: '🍔' },
  Transport:     { color: '#ffa94d', emoji: '🚗' },
  Shopping:      { color: '#a78bfa', emoji: '🛍' },
  Bills:         { color: '#60a5fa', emoji: '⚡' },
  Entertainment: { color: '#f472b6', emoji: '🎬' },
  Health:        { color: '#34d399', emoji: '💊' },
  Travel:        { color: '#fb923c', emoji: '✈️' },
  Other:         { color: '#94a3b8', emoji: '📦' },
  Income:        { color: '#00e5b0', emoji: '💰' },
};

const BUDGETS = { Food: 600, Transport: 200, Shopping: 300, Bills: 400, Entertainment: 150 };
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

/* ────────────────────────────────
   INIT
──────────────────────────────── */
function init() {
  // Set today's date in modal
  document.getElementById('tx-date').value = new Date().toISOString().split('T')[0];

  // Month display
  const now = new Date();
  document.getElementById('month-display').textContent = MONTHS[now.getMonth()] + ' ' + now.getFullYear();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  document.getElementById('days-left').textContent = (lastDay - now.getDate()) + ' days left';

  render();
}

/* ────────────────────────────────
   RENDER
──────────────────────────────── */
function render() {
  renderStats();
  renderTransactions();
  renderBarChart();
  renderDonut();
  renderBudget();
  renderInsight();
}

function renderStats() {
  const income  = transactions.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0);
  const balance = income - expense;
  document.getElementById('stat-balance').textContent = fmt(balance);
  document.getElementById('stat-expense').textContent = '-' + fmt(expense);
  document.getElementById('stat-income').textContent  = '+' + fmt(income);
}

function renderTransactions() {
  const list = document.getElementById('tx-list');
  if (!transactions.length) {
    list.innerHTML = `<div class="empty"><div class="e-icon">💳</div><p>No transactions yet. Add your first one!</p></div>`;
    return;
  }
  const sorted = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 15);
  list.innerHTML = sorted.map((t, i) => {
    const cat   = CATS[t.type === 'income' ? 'Income' : t.cat] || CATS['Other'];
    const delay = i * 0.04;
    return `<div class="tx-item" style="animation-delay:${delay}s">
      <div class="tx-icon" style="background:${cat.color}20;">${cat.emoji}</div>
      <div class="tx-info">
        <div class="tx-name">${esc(t.desc)}</div>
        <div class="tx-cat">${t.type === 'income' ? 'Income' : t.cat}</div>
      </div>
      <div class="tx-meta">
        <div class="tx-amount ${t.type === 'expense' ? 'neg' : 'pos'}">${t.type === 'expense' ? '-' : '+'}${fmt(t.amount)}</div>
        <div class="tx-date">${fmtDate(t.date)}</div>
      </div>
      <button class="tx-delete" onclick="deleteTransaction('${t.id}')" title="Delete">✕</button>
    </div>`;
  }).join('');
}

function renderBarChart() {
  const wrap    = document.getElementById('bar-chart');
  const labelEl = document.getElementById('bar-labels');
  const today   = new Date();
  const days    = [];

  for (let i = 6; i >= 0; i--) {
    const d   = new Date(today);
    d.setDate(today.getDate() - i);
    const key   = d.toISOString().split('T')[0];
    const total = transactions
      .filter(t => t.type === 'expense' && t.date === key)
      .reduce((a, t) => a + t.amount, 0);
    days.push({ label: DAYS[d.getDay()], total, key });
  }

  const max = Math.max(...days.map(d => d.total), 1);
  wrap.innerHTML = days.map(d => {
    const pct = (d.total / max) * 100;
    return `<div class="bar-group">
      <div class="bar-outer" style="flex:1;position:relative;">
        <div class="bar-inner" style="height:${pct}%;"></div>
      </div>
    </div>`;
  }).join('');
  labelEl.innerHTML = days.map(d => `<div class="bar-label">${d.label}</div>`).join('');
}

function renderDonut() {
  const svg    = document.getElementById('donut-svg');
  const catEl  = document.getElementById('cat-list');
  const expenses = transactions.filter(t => t.type === 'expense');
  const total    = expenses.reduce((a, t) => a + t.amount, 0);
  document.getElementById('donut-total').textContent = '$' + Math.round(total);

  if (!total) {
    svg.innerHTML = `<circle cx="80" cy="80" r="60" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="20"/>`;
    catEl.innerHTML = `<div style="text-align:center;color:var(--muted);font-size:13px;padding:12px 0;">No data yet</div>`;
    return;
  }

  // Aggregate by category
  const cats = {};
  expenses.forEach(t => { cats[t.cat] = (cats[t.cat] || 0) + t.amount; });
  const sorted = Object.entries(cats).sort((a, b) => b[1] - a[1]);

  const R = 60, CX = 80, CY = 80, STROKE = 20;
  const circ = 2 * Math.PI * R;
  let offset  = 0;
  let circles = '';

  sorted.forEach(([cat, amt]) => {
    const pct  = amt / total;
    const dash = pct * circ;
    const c    = (CATS[cat] || CATS.Other).color;
    circles += `<circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="${c}" stroke-width="${STROKE}" stroke-dasharray="${dash} ${circ - dash}" stroke-dashoffset="${-offset}" stroke-linecap="butt"/>`;
    offset  += dash;
  });

  svg.innerHTML =
    `<circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="${STROKE}"/>` +
    circles;

  catEl.innerHTML = sorted.slice(0, 5).map(([cat, amt]) => {
    const c   = (CATS[cat] || CATS.Other).color;
    const pct = Math.round(amt / total * 100);
    return `<div class="cat-row">
      <div class="cat-dot" style="background:${c}"></div>
      <div class="cat-name">${cat}</div>
      <div class="cat-bar-bg"><div class="cat-bar-fill" style="width:${pct}%;background:${c};"></div></div>
      <div class="cat-pct">${pct}%</div>
    </div>`;
  }).join('');
}

function renderBudget() {
  const meters   = document.getElementById('budget-meters');
  const expenses = transactions.filter(t => t.type === 'expense');
  const html = Object.entries(BUDGETS).map(([cat, limit]) => {
    const spent = expenses.filter(t => t.cat === cat).reduce((a, t) => a + t.amount, 0);
    const pct   = Math.min((spent / limit) * 100, 100);
    const color = pct > 90 ? 'var(--danger)' : pct > 70 ? 'var(--warn)' : 'var(--accent)';
    return `<div class="budget-section">
      <div class="budget-header">
        <span>${(CATS[cat] || CATS.Other).emoji} ${cat}</span>
        <span>${fmt(spent)} / ${fmt(limit)}</span>
      </div>
      <div class="budget-bar">
        <div class="budget-fill" style="width:${pct}%;background:${color};"></div>
      </div>
    </div>`;
  }).join('');
  meters.innerHTML = html;
}

function renderInsight() {
  const el       = document.getElementById('ai-insight');
  const expenses = transactions.filter(t => t.type === 'expense');
  const total    = expenses.reduce((a, t) => a + t.amount, 0);

  if (!expenses.length) {
    el.textContent = 'Add some transactions to get personalized spending insights.';
    return;
  }

  const cats = {};
  expenses.forEach(t => { cats[t.cat] = (cats[t.cat] || 0) + t.amount; });
  const top    = Object.entries(cats).sort((a, b) => b[1] - a[1])[0];
  const topPct = Math.round(top[1] / total * 100);

  const daySpend = {};
  expenses.forEach(t => { daySpend[t.date] = (daySpend[t.date] || 0) + t.amount; });
  const avgDay = Object.values(daySpend).length ? total / Object.values(daySpend).length : 0;

  const insights = [
    `Your biggest spending category is <strong>${top[0]}</strong>, accounting for <strong>${topPct}%</strong> of total expenses ($${fmt(top[1])}). Consider reviewing this area for potential savings.`,
    `You're averaging <strong>$${fmt(avgDay)}</strong> per active spending day. At this rate, your monthly estimate is around <strong>$${fmt(avgDay * 30)}</strong>.`,
    topPct > 50
      ? `⚠️ <strong>${top[0]}</strong> dominates your budget. Diversifying spending categories could improve financial balance.`
      : `Your spending is relatively well-distributed across categories — a healthy sign of balanced financial habits.`
  ];

  el.innerHTML = insights[Math.floor(Math.random() * insights.length)];
}

/* ────────────────────────────────
   MODAL
──────────────────────────────── */
function openModal() {
  document.getElementById('overlay').classList.add('open');
  document.getElementById('tx-desc').focus();
}

function closeModal() {
  document.getElementById('overlay').classList.remove('open');
  document.getElementById('tx-desc').value   = '';
  document.getElementById('tx-amount').value = '';
  setType('expense');
}

function handleOverlayClick(e) {
  if (e.target === document.getElementById('overlay')) closeModal();
}

function setType(t) {
  txType = t;
  const expBtn  = document.getElementById('type-expense');
  const incBtn  = document.getElementById('type-income');
  expBtn.className = 'type-btn' + (t === 'expense' ? ' active-expense' : '');
  incBtn.className = 'type-btn' + (t === 'income'  ? ' active-income'  : '');
  const catField = document.getElementById('tx-cat').parentElement;
  catField.style.display = t === 'income' ? 'none' : '';
}

function saveTransaction() {
  const desc   = document.getElementById('tx-desc').value.trim();
  const amount = parseFloat(document.getElementById('tx-amount').value);
  const cat    = document.getElementById('tx-cat').value;
  const date   = document.getElementById('tx-date').value;

  if (!desc)             { showToast('Please enter a description', 'error'); return; }
  if (!amount || amount <= 0) { showToast('Please enter a valid amount', 'error'); return; }
  if (!date)             { showToast('Please select a date', 'error'); return; }

  const tx = { id: uid(), type: txType, desc, amount, cat: txType === 'income' ? 'Income' : cat, date };
  transactions.unshift(tx);
  save();
  render();
  closeModal();
  showToast('Transaction added! 🎉', 'success');
}

function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  save();
  render();
  showToast('Transaction deleted', 'success');
}

function clearAll() {
  if (!transactions.length) return;
  if (confirm('Clear all transactions? This cannot be undone.')) {
    transactions = [];
    save();
    render();
    showToast('All transactions cleared', 'success');
  }
}

/* ────────────────────────────────
   NAVIGATION
──────────────────────────────── */
function setPage(page) {
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  event.currentTarget.classList.add('active');
  const titles = {
    dashboard:    'Your <span>Overview</span>',
    transactions: 'All <span>Transactions</span>',
    budget:       'Budget <span>Health</span>',
    insights:     'AI <span>Insights</span>',
  };
  document.getElementById('page-title').innerHTML = titles[page] || 'Dashboard';
}

function cycleChartView() { renderBarChart(); }

/* ────────────────────────────────
   HELPERS
──────────────────────────────── */
function fmt(n) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtDate(d) {
  if (!d) return '';
  const dt = new Date(d + 'T00:00:00');
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function esc(s) {
  return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function uid()  { return Math.random().toString(36).slice(2) + Date.now().toString(36); }
function save() { localStorage.setItem('spendly_tx', JSON.stringify(transactions)); }

function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.innerHTML  = (type === 'success' ? '✅ ' : '❌ ') + msg;
  t.className  = 'toast ' + type + ' show';
  setTimeout(() => t.classList.remove('show'), 3000);
}

/* ────────────────────────────────
   SEED DATA (demo)
──────────────────────────────── */
function seedDemo() {
  if (transactions.length) return;
  const today = new Date();
  const d = n => {
    const x = new Date(today);
    x.setDate(today.getDate() - n);
    return x.toISOString().split('T')[0];
  };
  transactions = [
    { id: uid(), type: 'income',  desc: 'Monthly Salary',      amount: 4500,  cat: 'Income',         date: d(20) },
    { id: uid(), type: 'income',  desc: 'Freelance Project',   amount: 800,   cat: 'Income',         date: d(12) },
    { id: uid(), type: 'expense', desc: 'Whole Foods Grocery', amount: 127.5, cat: 'Food',           date: d(1)  },
    { id: uid(), type: 'expense', desc: 'Netflix Subscription',amount: 15.99, cat: 'Entertainment',  date: d(2)  },
    { id: uid(), type: 'expense', desc: 'Uber Rides',          amount: 43.2,  cat: 'Transport',      date: d(3)  },
    { id: uid(), type: 'expense', desc: 'Electric Bill',       amount: 98,    cat: 'Bills',          date: d(4)  },
    { id: uid(), type: 'expense', desc: 'Amazon Order',        amount: 67.85, cat: 'Shopping',       date: d(5)  },
    { id: uid(), type: 'expense', desc: 'Coffee Shop',         amount: 18.5,  cat: 'Food',           date: d(0)  },
    { id: uid(), type: 'expense', desc: 'Gym Membership',      amount: 40,    cat: 'Health',         date: d(6)  },
    { id: uid(), type: 'expense', desc: 'Flight Tickets',      amount: 320,   cat: 'Travel',         date: d(8)  },
    { id: uid(), type: 'expense', desc: 'Spotify',             amount: 9.99,  cat: 'Entertainment',  date: d(2)  },
    { id: uid(), type: 'expense', desc: 'Restaurant Dinner',   amount: 85.4,  cat: 'Food',           date: d(3)  },
  ];
  save();
}

function scrollToBottom(){
  window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth"
    });
}
seedDemo();
init();
