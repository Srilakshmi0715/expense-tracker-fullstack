import React, { useState } from 'react';

const BudgetSection = ({ transactions, budgets, onSetBudget }) => {
  const [newBudget, setNewBudget] = useState({ category: 'food', amount: '' });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleSetBudget = () => {
    const amount = parseFloat(newBudget.amount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid budget amount');
      return;
    }

    onSetBudget(newBudget.category, amount);
    setNewBudget({ ...newBudget, amount: '' });
  };

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

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return '#dc3545';
    if (percentage >= 80) return '#ffc107';
    return '#28a745';
  };

  return (
    <section style={{ 
      padding: '2rem', 
      background: '#f8f9fa', 
      borderTop: '1px solid #e9ecef' 
    }}>
      <h3 style={{ marginBottom: '1.5rem', color: '#495057' }}>Budget Tracking</h3>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr auto', 
        gap: '1rem', 
        marginBottom: '2rem',
        alignItems: 'end'
      }}>
        <div className="form-group">
          <label htmlFor="budget-category">Category</label>
          <select
            id="budget-category"
            value={newBudget.category}
            onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid #e9ecef',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          >
            <option value="food">Food</option>
            <option value="transport">Transport</option>
            <option value="entertainment">Entertainment</option>
            <option value="shopping">Shopping</option>
            <option value="bills">Bills</option>
            <option value="healthcare">Healthcare</option>
            <option value="education">Education</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="budget-amount">Monthly Budget</label>
          <input
            type="number"
            id="budget-amount"
            value={newBudget.amount}
            onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })}
            placeholder="Enter budget amount..."
            step="0.01"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid #e9ecef',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          />
        </div>
        
        <button
          onClick={handleSetBudget}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            height: 'fit-content'
          }}
        >
          Set Budget
        </button>
      </div>

      <div>
        {Object.keys(budgets).length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            color: '#6c757d', 
            padding: '2rem',
            fontStyle: 'italic'
          }}>
            No budgets set yet. Set your first budget above!
          </div>
        ) : (
          Object.entries(budgets).map(([category, budget]) => {
            const spent = monthlyExpenses[category] || 0;
            const percentage = (spent / budget) * 100;
            
            return (
              <div
                key={category}
                style={{
                  background: 'white',
                  padding: '1rem',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginBottom: '0.5rem' 
                }}>
                  <span style={{ fontWeight: '500', textTransform: 'capitalize' }}>
                    {category}
                  </span>
                  <span style={{ fontWeight: '500' }}>
                    {formatCurrency(spent)} / {formatCurrency(budget)}
                  </span>
                </div>
                <div style={{ 
                  background: '#e9ecef', 
                  height: '10px', 
                  borderRadius: '5px', 
                  overflow: 'hidden' 
                }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.min(percentage, 100)}%`,
                      background: getProgressColor(percentage),
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>
                <div style={{ 
                  fontSize: '0.875rem', 
                  color: '#6c757d', 
                  marginTop: '0.25rem' 
                }}>
                  {percentage.toFixed(1)}% of budget used
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default BudgetSection;
