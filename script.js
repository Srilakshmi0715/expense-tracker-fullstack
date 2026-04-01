// Data Layer
let transactions = [];
let budgets = {};
let categoryChart, incomeExpenseChart;

// DOM Elements
const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expenseEl = document.getElementById('expense');
const transactionListEl = document.getElementById('transaction-list');
const form = document.getElementById('transaction-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const categoryInput = document.getElementById('category');
const searchInput = document.getElementById('search');
const filterCategoryEl = document.getElementById('filter-category');
const filterTypeEl = document.getElementById('filter-type');
const reportPeriodEl = document.getElementById('report-period');
const budgetCategoryEl = document.getElementById('budget-category');
const budgetAmountEl = document.getElementById('budget-amount');
const darkModeToggle = document.getElementById('dark-mode-toggle');

// Initialize App
function init() {
    // Load transactions from localStorage
    const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
    if (localStorageTransactions) {
        transactions = localStorageTransactions;
    }
    
    // Load budgets from localStorage
    const localStorageBudgets = JSON.parse(localStorage.getItem('budgets'));
    if (localStorageBudgets) {
        budgets = localStorageBudgets;
    }
    
    // Load dark mode preference
    const darkMode = localStorage.getItem('darkMode') === 'true';
    darkModeToggle.checked = darkMode;
    if (darkMode) {
        document.body.classList.add('dark-mode');
    }
    
    updateUI();
    updateCharts();
    updateBudgetProgress();
}

// Add Transaction
function addTransaction(e) {
    e.preventDefault();
    
    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const type = typeInput.value;
    const category = categoryInput.value;
    
    if (description === '' || isNaN(amount)) {
        alert('Please enter valid description and amount');
        return;
    }
    
    const transaction = {
        id: generateID(),
        description: description,
        amount: amount,
        type: type,
        category: category,
        date: new Date().toISOString()
    };
    
    transactions.push(transaction);
    
    // Save to localStorage
    saveTransactions();
    
    // Update UI
    updateUI();
    updateCharts();
    updateBudgetProgress();
    
    // Clear form
    descriptionInput.value = '';
    amountInput.value = '';
    typeInput.value = 'income';
    categoryInput.value = 'food';
    
    descriptionInput.focus();
}

// Delete Transaction
function deleteTransaction(id) {
    if (confirm('Are you sure you want to delete this transaction?')) {
        transactions = transactions.filter(transaction => transaction.id !== id);
        
        // Save to localStorage
        saveTransactions();
        
        // Update UI
        updateUI();
        updateCharts();
        updateBudgetProgress();
    }
}

// Generate Random ID
function generateID() {
    return Math.floor(Math.random() * 1000000000);
}

// Save to localStorage
function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Update UI
function updateUI() {
    updateBalance();
    updateSummary();
    updateTransactionList();
}

// Update Balance
function updateBalance() {
    const income = transactions
        .filter(transaction => transaction.type === 'income')
        .reduce((total, transaction) => total + transaction.amount, 0);
    
    const expenses = transactions
        .filter(transaction => transaction.type === 'expense')
        .reduce((total, transaction) => total + transaction.amount, 0);
    
    const balance = income - expenses;
    
    balanceEl.textContent = formatCurrency(balance);
    
    // Change color based on balance
    if (balance < 0) {
        balanceEl.style.color = '#dc3545';
    } else if (balance > 0) {
        balanceEl.style.color = '#28a745';
    } else {
        balanceEl.style.color = '#6c757d';
    }
}

// Update Summary
function updateSummary() {
    const income = transactions
        .filter(transaction => transaction.type === 'income')
        .reduce((total, transaction) => total + transaction.amount, 0);
    
    const expenses = transactions
        .filter(transaction => transaction.type === 'expense')
        .reduce((total, transaction) => total + transaction.amount, 0);
    
    incomeEl.textContent = `+${formatCurrency(income)}`;
    expenseEl.textContent = `-${formatCurrency(expenses)}`;
}

// Update Transaction List
function updateTransactionList() {
    // Get filter values
    const searchTerm = searchInput.value.toLowerCase();
    const filterCategory = filterCategoryEl.value;
    const filterType = filterTypeEl.value;
    
    // Filter transactions
    let filteredTransactions = transactions.filter(transaction => {
        const matchesSearch = transaction.description.toLowerCase().includes(searchTerm);
        const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory;
        const matchesType = filterType === 'all' || transaction.type === filterType;
        
        return matchesSearch && matchesCategory && matchesType;
    });
    
    // Sort transactions by date (newest first)
    const sortedTransactions = filteredTransactions.sort((a, b) => 
        new Date(b.date) - new Date(a.date)
    );
    
    if (sortedTransactions.length === 0) {
        transactionListEl.innerHTML = '<li class="empty-state">No transactions found matching your criteria.</li>';
        return;
    }
    
    transactionListEl.innerHTML = '';
    
    sortedTransactions.forEach(transaction => {
        const li = document.createElement('li');
        li.classList.add('transaction-item', transaction.type);
        
        const transactionInfo = document.createElement('div');
        transactionInfo.classList.add('transaction-info');
        
        const description = document.createElement('div');
        description.classList.add('transaction-description');
        description.textContent = `${transaction.description} (${transaction.category})`;
        
        const amount = document.createElement('div');
        amount.classList.add('transaction-amount', transaction.type);
        amount.textContent = transaction.type === 'income' 
            ? `+${formatCurrency(transaction.amount)}`
            : `-${formatCurrency(transaction.amount)}`;
        
        transactionInfo.appendChild(description);
        transactionInfo.appendChild(amount);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => deleteTransaction(transaction.id);
        
        li.appendChild(transactionInfo);
        li.appendChild(deleteBtn);
        
        transactionListEl.appendChild(li);
    });
}

// Format Currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Event Listeners
form.addEventListener('submit', addTransaction);
searchInput.addEventListener('input', updateTransactionList);
filterCategoryEl.addEventListener('change', updateTransactionList);
filterTypeEl.addEventListener('change', updateTransactionList);
reportPeriodEl.addEventListener('change', updateCharts);
darkModeToggle.addEventListener('change', toggleDarkMode);

// Additional event listeners
document.getElementById('export-csv').addEventListener('click', exportCSV);
document.getElementById('export-json').addEventListener('click', exportJSON);
document.getElementById('set-budget').addEventListener('click', setBudget);

// Budget Functions
function setBudget() {
    const category = budgetCategoryEl.value;
    const amount = parseFloat(budgetAmountEl.value);
    
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid budget amount');
        return;
    }
    
    budgets[category] = amount;
    localStorage.setItem('budgets', JSON.stringify(budgets));
    
    budgetAmountEl.value = '';
    updateBudgetProgress();
    
    alert(`Budget set for ${category}: ${formatCurrency(amount)}`);
}

function updateBudgetProgress() {
    const budgetProgressEl = document.getElementById('budget-progress');
    
    if (Object.keys(budgets).length === 0) {
        budgetProgressEl.innerHTML = '<p class="empty-state">No budgets set yet.</p>';
        return;
    }
    
    budgetProgressEl.innerHTML = '';
    
    // Calculate current month expenses by category
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyExpenses = {};
    
    transactions
        .filter(t => t.type === 'expense')
        .forEach(transaction => {
            const transactionDate = new Date(transaction.date);
            if (transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear) {
                monthlyExpenses[transaction.category] = (monthlyExpenses[transaction.category] || 0) + transaction.amount;
            }
        });
    
    Object.entries(budgets).forEach(([category, budget]) => {
        const spent = monthlyExpenses[category] || 0;
        const percentage = (spent / budget) * 100;
        
        const budgetItem = document.createElement('div');
        budgetItem.classList.add('budget-item');
        
        const header = document.createElement('div');
        header.classList.add('budget-item-header');
        header.innerHTML = `
            <span>${category.charAt(0).toUpperCase() + category.slice(1)}</span>
            <span>${formatCurrency(spent)} / ${formatCurrency(budget)}</span>
        `;
        
        const progressBar = document.createElement('div');
        progressBar.classList.add('budget-progress-bar');
        
        const progressFill = document.createElement('div');
        progressFill.classList.add('budget-progress-fill');
        progressFill.style.width = `${Math.min(percentage, 100)}%`;
        
        if (percentage >= 100) {
            progressFill.classList.add('danger');
        } else if (percentage >= 80) {
            progressFill.classList.add('warning');
        } else {
            progressFill.classList.add('success');
        }
        
        progressBar.appendChild(progressFill);
        budgetItem.appendChild(header);
        budgetItem.appendChild(progressBar);
        budgetProgressEl.appendChild(budgetItem);
    });
}

// Chart Functions
function updateCharts() {
    const period = reportPeriodEl.value;
    const filteredTransactions = filterTransactionsByPeriod(transactions, period);
    
    updateCategoryChart(filteredTransactions);
    updateIncomeExpenseChart(filteredTransactions);
}

function filterTransactionsByPeriod(transactions, period) {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        
        switch (period) {
            case 'month':
                return transactionDate.getMonth() === currentMonth && 
                       transactionDate.getFullYear() === currentYear;
            case 'year':
                return transactionDate.getFullYear() === currentYear;
            case 'all':
                return true;
            default:
                return true;
        }
    });
}

function updateCategoryChart(transactions) {
    const ctx = document.getElementById('category-chart').getContext('2d');
    
    const expensesByCategory = {};
    transactions
        .filter(t => t.type === 'expense')
        .forEach(transaction => {
            expensesByCategory[transaction.category] = (expensesByCategory[transaction.category] || 0) + transaction.amount;
        });
    
    if (categoryChart) {
        categoryChart.destroy();
    }
    
    categoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(expensesByCategory),
            datasets: [{
                data: Object.values(expensesByCategory),
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
                    '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function updateIncomeExpenseChart(transactions) {
    const ctx = document.getElementById('income-expense-chart').getContext('2d');
    
    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    
    if (incomeExpenseChart) {
        incomeExpenseChart.destroy();
    }
    
    incomeExpenseChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Income', 'Expenses'],
            datasets: [{
                data: [income, expenses],
                backgroundColor: ['#28a745', '#dc3545']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Export Functions
function exportCSV() {
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    const rows = transactions.map(t => [
        new Date(t.date).toLocaleDateString(),
        t.description,
        t.category,
        t.type,
        t.amount
    ]);
    
    const csvContent = [headers, ...rows]
        .map(row => row.join(','))
        .join('\n');
    
    downloadFile(csvContent, 'transactions.csv', 'text/csv');
}

function exportJSON() {
    const jsonContent = JSON.stringify(transactions, null, 2);
    downloadFile(jsonContent, 'transactions.json', 'application/json');
}

function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// Dark Mode
function toggleDarkMode() {
    const isDarkMode = darkModeToggle.checked;
    document.body.classList.toggle('dark-mode', isDarkMode);
    localStorage.setItem('darkMode', isDarkMode);
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
