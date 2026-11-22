// WealthPulse — Core Interactive Engine (Premium White SaaS Theme)
// Provides dynamic calculators, compound interest simulator, quiz engine, AI Copilot, currency switcher, and state management

let currentCurrency = '$';
let budgetChartInstance = null;
let compoundChartInstance = null;

document.addEventListener('DOMContentLoaded', () => {
    // Enforce clean premium light theme as default
    document.documentElement.classList.remove('dark');
    localStorage.setItem('wealthpulse_theme', 'light');

    initCurrencySwitcher();
    initBudgetCalculator();
    initDebtCalculator();
    initEmergencyFundPlanner();
    initCompoundInterestCalculator();
    initHealthQuiz();
    initCopilot();
    initBookmarks();
    initSearch();
    initContactForm();
});

/* ----------------------------------------------------
   1. Currency Switcher ($ USD, € EUR, £ GBP, ₹ INR)
---------------------------------------------------- */
function initCurrencySwitcher() {
    const selector = document.getElementById('currency-selector');
    const savedCur = localStorage.getItem('wealthpulse_currency');
    if (savedCur) {
        currentCurrency = savedCur;
        if (selector) selector.value = savedCur;
    }

    if (selector) {
        selector.addEventListener('change', (e) => {
            currentCurrency = e.target.value;
            localStorage.setItem('wealthpulse_currency', currentCurrency);
            
            // Refresh active calculators
            const incomeInput = document.getElementById('budget-income');
            if (incomeInput) updateBudgetOutputs(parseFloat(incomeInput.value) || 0);
            updateEmergencyFundOutputs();
            calculateCompoundInterest();
        });
    }
}

function formatMoney(amount) {
    return `${currentCurrency}${Math.round(amount).toLocaleString()}`;
}

/* ----------------------------------------------------
   2. 50/30/20 Smart Budget Calculator with Chart.js
---------------------------------------------------- */
function initBudgetCalculator() {
    const incomeInput = document.getElementById('budget-income');
    const incomeSlider = document.getElementById('budget-slider');
    const exportBtn = document.getElementById('export-budget-btn');

    if (!incomeInput || !incomeSlider) return;

    function syncIncome(val) {
        const num = Math.max(0, parseInt(val) || 0);
        incomeInput.value = num;
        incomeSlider.value = num;
        updateBudgetOutputs(num);
    }

    incomeInput.addEventListener('input', (e) => syncIncome(e.target.value));
    incomeSlider.addEventListener('input', (e) => syncIncome(e.target.value));

    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const income = parseInt(incomeInput.value) || 0;
            const needs = (income * 0.50).toFixed(2);
            const wants = (income * 0.30).toFixed(2);
            const savings = (income * 0.20).toFixed(2);
            
            const csvContent = "data:text/csv;charset=utf-8," 
                + "Category,Percentage,Monthly Amount\n"
                + `Total Income,100%,${currentCurrency}${income}\n`
                + `Needs (Essentials),50%,${currentCurrency}${needs}\n`
                + `Wants (Lifestyle),30%,${currentCurrency}${wants}\n`
                + `Savings & Debt Freedom,20%,${currentCurrency}${savings}\n`;
            
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `wealthpulse_budget_${income}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    // Initial render
    syncIncome(incomeInput.value || 5000);
}

function updateBudgetOutputs(income) {
    const needs = income * 0.50;
    const wants = income * 0.30;
    const savings = income * 0.20;

    const needsEl = document.getElementById('val-needs');
    const wantsEl = document.getElementById('val-wants');
    const savingsEl = document.getElementById('val-savings');

    if (needsEl) needsEl.textContent = formatMoney(needs);
    if (wantsEl) wantsEl.textContent = formatMoney(wants);
    if (savingsEl) savingsEl.textContent = formatMoney(savings);

    // Update Chart.js (Premium Blue/Soft Green Theme)
    const ctx = document.getElementById('budgetChart');
    if (!ctx) return;

    if (!budgetChartInstance) {
        budgetChartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Needs (50%)', 'Wants (30%)', 'Savings (20%)'],
                datasets: [{
                    data: [needs, wants, savings],
                    backgroundColor: ['#059669', '#2563eb', '#f59e0b'],
                    borderWidth: 3,
                    borderColor: '#ffffff',
                    hoverOffset: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            boxWidth: 12,
                            padding: 16,
                            color: '#1e293b',
                            font: { family: 'Inter', size: 12, weight: '500' }
                        }
                    }
                },
                cutout: '70%'
            }
        });
    } else {
        budgetChartInstance.data.datasets[0].data = [needs, wants, savings];
        budgetChartInstance.update();
    }
}

/* ----------------------------------------------------
   3. Debt Payoff Simulator (Snowball vs Avalanche)
---------------------------------------------------- */
function initDebtCalculator() {
    const calcBtn = document.getElementById('calc-debt-btn');
    if (!calcBtn) return;

    calcBtn.addEventListener('click', calculateDebtPayoff);
}

function calculateDebtPayoff() {
    const b1 = parseFloat(document.getElementById('debt1-balance')?.value) || 0;
    const r1 = (parseFloat(document.getElementById('debt1-rate')?.value) || 0) / 100 / 12;
    const p1 = parseFloat(document.getElementById('debt1-min')?.value) || 0;

    const b2 = parseFloat(document.getElementById('debt2-balance')?.value) || 0;
    const r2 = (parseFloat(document.getElementById('debt2-rate')?.value) || 0) / 100 / 12;
    const p2 = parseFloat(document.getElementById('debt2-min')?.value) || 0;

    const extra = parseFloat(document.getElementById('debt-extra-payment')?.value) || 0;

    const totalBalance = b1 + b2;
    if (totalBalance <= 0) return;

    const snowball = simulateDebts([
        { name: 'Debt A', balance: b1, rate: r1, min: p1 },
        { name: 'Debt B', balance: b2, rate: r2, min: p2 }
    ].sort((a, b) => a.balance - b.balance), extra);

    const avalanche = simulateDebts([
        { name: 'Debt A', balance: b1, rate: r1, min: p1 },
        { name: 'Debt B', balance: b2, rate: r2, min: p2 }
    ].sort((a, b) => b.rate - a.rate), extra);

    const resultBox = document.getElementById('debt-result-box');
    if (resultBox) {
        resultBox.classList.remove('hidden');
        document.getElementById('snowball-months').textContent = `${snowball.months} months`;
        document.getElementById('snowball-interest').textContent = formatMoney(snowball.totalInterest) + ' interest';
        document.getElementById('avalanche-months').textContent = `${avalanche.months} months`;
        document.getElementById('avalanche-interest').textContent = formatMoney(avalanche.totalInterest) + ' interest';

        const interestSaved = Math.max(0, Math.round(snowball.totalInterest - avalanche.totalInterest));
        document.getElementById('avalanche-savings').textContent = `${formatMoney(interestSaved)} saved in interest with Avalanche method!`;
    }
}

function simulateDebts(debtsArray, extraMonthly) {
    let debts = debtsArray.map(d => ({ ...d }));
    let months = 0;
    let totalInterest = 0;

    while (debts.some(d => d.balance > 0) && months < 360) {
        months++;
        let availableExtra = extraMonthly;

        debts.forEach(d => {
            if (d.balance > 0) {
                const interest = d.balance * d.rate;
                totalInterest += interest;
                d.balance += interest;
            }
        });

        debts.forEach(d => {
            if (d.balance > 0) {
                const payment = Math.min(d.balance, d.min);
                d.balance -= payment;
            }
        });

        for (let d of debts) {
            if (d.balance > 0) {
                const extraPay = Math.min(d.balance, availableExtra);
                d.balance -= extraPay;
                availableExtra -= extraPay;
                if (availableExtra <= 0) break;
            }
        }
    }

    return { months, totalInterest };
}

/* ----------------------------------------------------
   4. Emergency Fund Goal Planner
---------------------------------------------------- */
function initEmergencyFundPlanner() {
    const expenseInput = document.getElementById('monthly-expense');
    const currentSavedInput = document.getElementById('current-saved');
    const monthlySavingInput = document.getElementById('monthly-saving-capacity');

    if (!expenseInput) return;

    [expenseInput, currentSavedInput, monthlySavingInput].forEach(el => {
        if (el) el.addEventListener('input', updateEmergencyFundOutputs);
    });

    updateEmergencyFundOutputs();
}

function updateEmergencyFundOutputs() {
    const expenseInput = document.getElementById('monthly-expense');
    const currentSavedInput = document.getElementById('current-saved');
    const monthlySavingInput = document.getElementById('monthly-saving-capacity');

    if (!expenseInput) return;

    const monthlyExp = parseFloat(expenseInput.value) || 0;
    const saved = parseFloat(currentSavedInput?.value) || 0;
    const capacity = parseFloat(monthlySavingInput?.value) || 0;

    const target3M = monthlyExp * 3;
    const target6M = monthlyExp * 6;

    const el3M = document.getElementById('fund-target-3m');
    const el6M = document.getElementById('fund-target-6m');
    if (el3M) el3M.textContent = formatMoney(target3M);
    if (el6M) el6M.textContent = formatMoney(target6M);

    const pct = target6M > 0 ? Math.min(100, Math.round((saved / target6M) * 100)) : 0;
    const progressBar = document.getElementById('fund-progress-bar');
    const progressPctText = document.getElementById('fund-progress-pct');

    if (progressBar) progressBar.style.width = `${pct}%`;
    if (progressPctText) progressPctText.textContent = `${pct}% Completed`;

    const monthsToGoal = capacity > 0 && target6M > saved 
        ? Math.ceil((target6M - saved) / capacity) 
        : 0;

    const etaEl = document.getElementById('fund-eta');
    if (etaEl) {
        etaEl.textContent = monthsToGoal > 0 
            ? `${monthsToGoal} months to reach full 6-month safety net` 
            : (saved >= target6M ? 'Goal fully achieved! 🎉' : 'Enter savings capacity to calculate timeline');
    }
}

/* ----------------------------------------------------
   5. Compound Interest & Investment Growth Simulator
---------------------------------------------------- */
function initCompoundInterestCalculator() {
    const calcBtn = document.getElementById('calc-compound-btn');
    if (!calcBtn) return;

    ['compound-initial', 'compound-monthly', 'compound-rate', 'compound-years'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', calculateCompoundInterest);
    });

    calcBtn.addEventListener('click', calculateCompoundInterest);
    calculateCompoundInterest();
}

function calculateCompoundInterest() {
    const principal = parseFloat(document.getElementById('compound-initial')?.value) || 0;
    const monthlyAdd = parseFloat(document.getElementById('compound-monthly')?.value) || 0;
    const annualRate = (parseFloat(document.getElementById('compound-rate')?.value) || 0) / 100;
    const years = parseInt(document.getElementById('compound-years')?.value) || 10;

    if (years <= 0) return;

    let total = principal;
    let totalInvested = principal;
    const labels = [];
    const investedData = [];
    const totalData = [];

    const monthlyRate = annualRate / 12;
    const totalMonths = years * 12;

    for (let m = 1; m <= totalMonths; m++) {
        total = (total + monthlyAdd) * (1 + monthlyRate);
        totalInvested += monthlyAdd;

        if (m % 12 === 0 || m === totalMonths) {
            labels.push(`Year ${m / 12}`);
            investedData.push(Math.round(totalInvested));
            totalData.push(Math.round(total));
        }
    }

    const interestEarned = Math.max(0, total - totalInvested);

    const elTotal = document.getElementById('compound-val-total');
    const elInvested = document.getElementById('compound-val-invested');
    const elInterest = document.getElementById('compound-val-interest');

    if (elTotal) elTotal.textContent = formatMoney(total);
    if (elInvested) elInvested.textContent = formatMoney(totalInvested);
    if (elInterest) elInterest.textContent = formatMoney(interestEarned);

    const ctx = document.getElementById('compoundChart');
    if (!ctx) return;

    if (!compoundChartInstance) {
        compoundChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Principal & Contributions',
                        data: investedData,
                        backgroundColor: '#2563eb',
                        borderRadius: 6
                    },
                    {
                        label: 'Compound Interest Growth',
                        data: totalData.map((tot, idx) => tot - investedData[idx]),
                        backgroundColor: '#059669',
                        borderRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { 
                        stacked: true,
                        grid: { color: '#f1f5f9' },
                        ticks: { color: '#475569' }
                    },
                    y: { 
                        stacked: true,
                        grid: { color: '#f1f5f9' },
                        ticks: {
                            color: '#475569',
                            callback: function(value) {
                                return currentCurrency + value.toLocaleString();
                            }
                        }
                    }
                },
                plugins: {
                    legend: { 
                        position: 'bottom',
                        labels: { color: '#1e293b', font: { family: 'Inter', size: 12 } }
                    }
                }
            }
        });
    } else {
        compoundChartInstance.data.labels = labels;
        compoundChartInstance.data.datasets[0].data = investedData;
        compoundChartInstance.data.datasets[1].data = totalData.map((tot, idx) => tot - investedData[idx]);
        compoundChartInstance.update();
    }
}

/* ----------------------------------------------------
   6. Financial Health Scorecard / Assessment Quiz
---------------------------------------------------- */
const quizState = {
    step: 0,
    answers: [],
    questions: [
        {
            q: "How many months of basic living expenses do you currently have saved in an emergency buffer?",
            options: [
                { label: "Less than 1 month", points: 5 },
                { label: "1 to 2 months", points: 15 },
                { label: "3 to 5 months", points: 25 },
                { label: "6+ months in high-yield cash", points: 30 }
            ]
        },
        {
            q: "What does your high-interest debt (credit cards, personal loans >7%) look like?",
            options: [
                { label: "High balance that I struggle to pay minimums on", points: 0 },
                { label: "Carrying a moderate balance month-to-month", points: 10 },
                { label: "Paying down actively and making consistent progress", points: 20 },
                { label: "Zero high-interest debt / paid in full every month", points: 25 }
            ]
        },
        {
            q: "Do you have a consistent monthly budget or tracking system?",
            options: [
                { label: "No system, I just spend as needs arise", points: 0 },
                { label: "Mental track of major bills only", points: 5 },
                { label: "Rough monthly budget that I occasionally follow", points: 15 },
                { label: "Structured framework (e.g. 50/30/20 or Zero-Based)", points: 20 }
            ]
        },
        {
            q: "How consistently do you invest for retirement or long-term growth?",
            options: [
                { label: "Never or not yet started", points: 0 },
                { label: "Irregularly when I have leftover cash", points: 8 },
                { label: "Capturing employer 401(k) match / regular deposits", points: 15 },
                { label: "Maxing tax-advantaged accounts + automated investing", points: 25 }
            ]
        }
    ]
};

function initHealthQuiz() {
    const startBtn = document.getElementById('start-quiz-btn');
    if (startBtn) {
        startBtn.addEventListener('click', renderQuizStep);
    }
}

function renderQuizStep() {
    const container = document.getElementById('quiz-content');
    if (!container) return;

    if (quizState.step >= quizState.questions.length) {
        showQuizResults(container);
        return;
    }

    const currentQ = quizState.questions[quizState.step];
    container.innerHTML = `
        <div class="mb-4 flex items-center justify-between text-xs font-semibold text-blue-600">
            <span>QUESTION ${quizState.step + 1} OF ${quizState.questions.length}</span>
            <span>${Math.round((quizState.step / quizState.questions.length) * 100)}%</span>
        </div>
        <h4 class="text-lg font-bold text-slate-900 mb-4">${currentQ.q}</h4>
        <div class="space-y-3">
            ${currentQ.options.map((opt, idx) => `
                <button onclick="handleQuizAnswer(${opt.points})" 
                        class="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 bg-white transition flex items-center justify-between group shadow-2xs">
                    <span class="text-sm font-medium text-slate-700 group-hover:text-blue-700">${opt.label}</span>
                    <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition"></i>
                </button>
            `).join('')}
        </div>
    `;
    if (window.lucide) lucide.createIcons();
}

window.handleQuizAnswer = function(points) {
    quizState.answers.push(points);
    quizState.step++;
    renderQuizStep();
};

function showQuizResults(container) {
    const score = quizState.answers.reduce((acc, curr) => acc + curr, 0);
    let tier = { title: "Foundation Stage", color: "text-amber-600", desc: "Priority: Secure a $1,000 starter emergency fund, capture employer 401(k) matching, and eliminate high-interest revolving credit." };

    if (score >= 80) {
        tier = { title: "Wealth Accelerator", color: "text-emerald-600", desc: "Top-tier health! Your focus should be tax-loss harvesting, maxing IRA/HSA limits, and automated broad-market compounding." };
    } else if (score >= 50) {
        tier = { title: "Solid Momentum", color: "text-blue-600", desc: "Great financial habits. Next milestones: expand emergency savings to 3–6 months and apply the Debt Avalanche method." };
    }

    container.innerHTML = `
        <div class="text-center py-4">
            <div class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-50 border-4 border-blue-500 mb-4">
                <span class="text-3xl font-black text-blue-600">${score}</span>
                <span class="text-xs font-semibold text-slate-500">/100</span>
            </div>
            <h4 class="text-xl font-bold ${tier.color} mb-1">${tier.title}</h4>
            <p class="text-sm text-slate-600 max-w-md mx-auto mb-6">${tier.desc}</p>
            <div class="flex flex-col sm:flex-row gap-3 justify-center">
                <a href="calculators.html" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-sm transition shadow-sm">Explore All Calculators</a>
                <button onclick="resetQuiz()" class="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium rounded-xl text-sm transition">Retake Quiz</button>
            </div>
        </div>
    `;
    if (window.lucide) lucide.createIcons();
}

window.resetQuiz = function() {
    quizState.step = 0;
    quizState.answers = [];
    renderQuizStep();
};

/* ----------------------------------------------------
   7. AI Financial Copilot Chat Drawer
---------------------------------------------------- */
function initCopilot() {
    const copilotBtn = document.getElementById('open-copilot-btn');
    const closeCopilotBtn = document.getElementById('close-copilot-btn');
    const copilotDrawer = document.getElementById('copilot-drawer');
    const copilotForm = document.getElementById('copilot-form');
    const copilotInput = document.getElementById('copilot-input');
    const copilotMessages = document.getElementById('copilot-messages');

    if (!copilotDrawer) return;

    function toggleCopilot(open) {
        if (open) {
            copilotDrawer.classList.remove('translate-x-full');
        } else {
            copilotDrawer.classList.add('translate-x-full');
        }
    }

    if (copilotBtn) copilotBtn.addEventListener('click', () => toggleCopilot(true));
    if (closeCopilotBtn) closeCopilotBtn.addEventListener('click', () => toggleCopilot(false));

    document.querySelectorAll('.preset-prompt').forEach(btn => {
        btn.addEventListener('click', () => {
            const query = btn.getAttribute('data-query');
            if (copilotInput) {
                copilotInput.value = query;
                copilotForm.dispatchEvent(new Event('submit'));
            }
        });
    });

    if (copilotForm) {
        copilotForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = copilotInput.value.trim();
            if (!text) return;

            appendCopilotMessage('user', text);
            copilotInput.value = '';

            setTimeout(() => {
                const response = generateCopilotAdvice(text);
                appendCopilotMessage('bot', response);
            }, 350);
        });
    }

    function appendCopilotMessage(sender, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = sender === 'user' 
            ? 'flex justify-end' 
            : 'flex justify-start';

        msgDiv.innerHTML = `
            <div class="${sender === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-800 border border-slate-200'} max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-xs leading-relaxed">
                ${text}
            </div>
        `;
        copilotMessages.appendChild(msgDiv);
        copilotMessages.scrollTop = copilotMessages.scrollHeight;
    }
}

function generateCopilotAdvice(input) {
    const q = input.toLowerCase();
    if (q.includes('snowball') || q.includes('avalanche') || q.includes('debt')) {
        return "<strong>Debt Strategy Overview:</strong><br>• <strong>Debt Avalanche:</strong> Pay minimums on all debts, throw extra cash at the debt with the <em>highest APR</em>. Mathematically saves the most interest.<br>• <strong>Debt Snowball:</strong> Pay smallest balances first for psychological momentum. Both are great—consistency is what matters!";
    }
    if (q.includes('50/30/20') || q.includes('budget') || q.includes('income')) {
        return "<strong>The 50/30/20 Framework:</strong><br>• <strong>50% Needs:</strong> Rent/mortgage, utilities, essential groceries, minimum debt payments.<br>• <strong>30% Wants:</strong> Dining out, hobbies, subscriptions.<br>• <strong>20% Savings:</strong> Emergency fund, retirement accounts, and extra debt principal.";
    }
    if (q.includes('emergency') || q.includes('save') || q.includes('how much')) {
        return "<strong>Emergency Fund Rule of Thumb:</strong><br>1. Start with a $1,000 starter buffer.<br>2. Expand to 3-6 months of baseline living expenses.<br>3. Keep this fund in a High-Yield Savings Account (HYSA) so it earns interest while staying 100% liquid.";
    }
    if (q.includes('credit') || q.includes('score')) {
        return "<strong>Top 3 Credit Score Levers:</strong><br>1. <strong>Payment History (35%):</strong> Never miss a due date. Set autopay for minimums.<br>2. <strong>Credit Utilization (30%):</strong> Keep balances below 30% (ideally under 10%) of credit limits.<br>3. <strong>Credit Age (15%):</strong> Keep older fee-free accounts open.";
    }
    if (q.includes('compound') || q.includes('invest') || q.includes('stocks')) {
        return "<strong>The Power of Compound Interest:</strong><br>Investing just $300/month in a diversified index fund (averaging 8% annual returns) grows to over <strong>$178,000 in 20 years</strong>, with more than $100,000 of that coming from interest alone!";
    }
    return "Great question! The foundational financial order of operations recommends: (1) $1,000 starter emergency fund, (2) Capture employer 401(k) match, (3) Pay off high-interest debt (>7%), (4) Build 3-6 month emergency fund, and (5) Invest 15-20% for retirement.";
}

/* ----------------------------------------------------
   8. Bookmarking System
---------------------------------------------------- */
function initBookmarks() {
    updateBookmarkUI();
    document.querySelectorAll('.bookmark-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const id = btn.getAttribute('data-id');
            const title = btn.getAttribute('data-title');
            toggleBookmark(id, title);
            updateBookmarkUI();
        });
    });
}

function toggleBookmark(id, title) {
    let saved = JSON.parse(localStorage.getItem('wealthpulse_saved_guides') || '[]');
    const existing = saved.findIndex(item => item.id === id);
    if (existing > -1) {
        saved.splice(existing, 1);
    } else {
        saved.push({ id, title, date: new Date().toLocaleDateString() });
    }
    localStorage.setItem('wealthpulse_saved_guides', JSON.stringify(saved));
}

function updateBookmarkUI() {
    const saved = JSON.parse(localStorage.getItem('wealthpulse_saved_guides') || '[]');
    document.querySelectorAll('.bookmark-btn').forEach(btn => {
        const id = btn.getAttribute('data-id');
        const isSaved = saved.some(item => item.id === id);
        if (isSaved) {
            btn.classList.add('text-blue-600', 'fill-blue-600');
        } else {
            btn.classList.remove('text-blue-600', 'fill-blue-600');
        }
    });

    const countBadge = document.getElementById('saved-count');
    if (countBadge) {
        countBadge.textContent = saved.length;
        countBadge.classList.toggle('hidden', saved.length === 0);
    }
}

/* ----------------------------------------------------
   9. Search & Category Filter
---------------------------------------------------- */
function initSearch() {
    const searchInput = document.getElementById('guide-search');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const cards = document.querySelectorAll('.guide-card');

        cards.forEach(card => {
            const title = card.getAttribute('data-title')?.toLowerCase() || '';
            const category = card.getAttribute('data-category')?.toLowerCase() || '';
            const text = card.textContent.toLowerCase();

            if (title.includes(query) || category.includes(query) || text.includes(query)) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    });
}

/* ----------------------------------------------------
   10. Contact & Lead Capture
---------------------------------------------------- */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const alertBox = document.getElementById('contact-alert');
            if (alertBox) {
                alertBox.classList.remove('hidden');
                contactForm.reset();
            }
        });
    }
}
