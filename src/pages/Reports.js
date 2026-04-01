import React, { useState, useEffect } from 'react';
import ExpenseChart from '../components/ExpenseChart';
import IncomeExpenseChart from '../components/IncomeExpenseChart';
import AdvancedCharts from '../components/AdvancedCharts';
import ExportButtons from '../components/ExportButtons';

const Reports = () => {
  const [transactions, setTransactions] = useState([]);
  const [reportPeriod, setReportPeriod] = useState('month');
  const [chartType, setChartType] = useState('basic');

  useEffect(() => {
    // Load transactions from localStorage
    const savedTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    setTransactions(savedTransactions);
  }, []);

  const filterTransactionsByPeriod = (transactions, period) => {
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
  };

  const filteredTransactions = filterTransactionsByPeriod(transactions, reportPeriod);

  return (
    <div className="container">
      <section style={{ padding: '2rem' }}>
        <h2 style={{ marginBottom: '2rem', color: '#495057' }}>📊 Reports & Analytics</h2>
        
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ marginRight: '1rem', fontWeight: '500' }}>Report Period:</label>
          <select 
            value={reportPeriod} 
            onChange={(e) => setReportPeriod(e.target.value)}
            style={{
              padding: '0.5rem 1rem',
              border: '2px solid #e9ecef',
              borderRadius: '6px',
              fontSize: '1rem',
              marginRight: '1rem'
            }}
          >
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
          
          <label style={{ marginRight: '1rem', fontWeight: '500' }}>Chart Type:</label>
          <select 
            value={chartType} 
            onChange={(e) => setChartType(e.target.value)}
            style={{
              padding: '0.5rem 1rem',
              border: '2px solid #e9ecef',
              borderRadius: '6px',
              fontSize: '1rem'
            }}
          >
            <option value="basic">Basic Charts</option>
            <option value="advanced">Advanced Analytics</option>
          </select>
        </div>

        {chartType === 'basic' ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '2rem', 
            marginBottom: '2rem' 
          }}>
            <div>
              <h3 style={{ marginBottom: '1rem', textAlign: 'center' }}>Expenses by Category</h3>
              <ExpenseChart transactions={filteredTransactions} />
            </div>
            <div>
              <h3 style={{ marginBottom: '1rem', textAlign: 'center' }}>Income vs Expenses</h3>
              <IncomeExpenseChart transactions={filteredTransactions} />
            </div>
          </div>
        ) : (
          <AdvancedCharts transactions={filteredTransactions} />
        )}

        <ExportButtons transactions={transactions} />
      </section>
    </div>
  );
};

export default Reports;
