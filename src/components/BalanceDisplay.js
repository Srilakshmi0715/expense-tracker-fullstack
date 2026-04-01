import React from 'react';

const BalanceDisplay = ({ transactions }) => {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const balance = income - expenses;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <>
      <section className="balance-section">
        <h2>Your Balance</h2>
        <div className="balance" style={{ 
          color: balance < 0 ? '#dc3545' : balance > 0 ? '#28a745' : '#6c757d' 
        }}>
          {formatCurrency(balance)}
        </div>
      </section>

      <section className="summary-section">
        <div className="income-box">
          <h3>Income</h3>
          <div className="income">+{formatCurrency(income)}</div>
        </div>
        <div className="expense-box">
          <h3>Expenses</h3>
          <div className="expense">-{formatCurrency(expenses)}</div>
        </div>
      </section>
    </>
  );
};

export default BalanceDisplay;
