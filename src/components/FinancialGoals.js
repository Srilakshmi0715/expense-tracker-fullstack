import React, { useState, useEffect } from 'react';

const FinancialGoals = () => {
  const [goals, setGoals] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
    category: 'savings'
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('financialGoals') || '[]');
    setGoals(saved);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.targetAmount || !formData.deadline) {
      alert('Please fill in all required fields');
      return;
    }

    const newGoal = {
      id: Date.now(),
      ...formData,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount) || 0,
      createdAt: new Date().toISOString()
    };

    const updated = [...goals, newGoal];
    setGoals(updated);
    localStorage.setItem('financialGoals', JSON.stringify(updated));
    
    // Reset form
    setFormData({
      title: '',
      targetAmount: '',
      currentAmount: '',
      deadline: '',
      category: 'savings'
    });
  };

  const updateProgress = (id, amount) => {
    const updated = goals.map(goal => 
      goal.id === id ? { ...goal, currentAmount: amount } : goal
    );
    setGoals(updated);
    localStorage.setItem('financialGoals', JSON.stringify(updated));
  };

  const deleteGoal = (id) => {
    if (window.confirm('Are you sure you want to delete this financial goal?')) {
      const updated = goals.filter(g => g.id !== id);
      setGoals(updated);
      localStorage.setItem('financialGoals', JSON.stringify(updated));
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const calculateProgress = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return '#28a745';
    if (percentage >= 75) return '#ffc107';
    if (percentage >= 50) return '#17a2b8';
    return '#dc3545';
  };

  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return '1 day';
    return `${diffDays} days`;
  };

  return (
    <section style={{ 
      padding: '2rem', 
      background: '#f8f9fa', 
      borderTop: '1px solid #e9ecef' 
    }}>
      <h3 style={{ marginBottom: '1.5rem', color: '#495057' }}>🎯 Financial Goals</h3>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '1rem', 
          marginBottom: '1rem' 
        }}>
          <div className="form-group">
            <label>Goal Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Emergency Fund, Vacation"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="savings">Savings</option>
              <option value="investment">Investment</option>
              <option value="debt">Debt Payoff</option>
              <option value="purchase">Purchase</option>
              <option value="education">Education</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr 1fr', 
          gap: '1rem', 
          marginBottom: '1rem' 
        }}>
          <div className="form-group">
            <label>Target Amount</label>
            <input
              type="number"
              name="targetAmount"
              value={formData.targetAmount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Current Amount</label>
            <input
              type="number"
              name="currentAmount"
              value={formData.currentAmount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
            />
          </div>
          
          <div className="form-group">
            <label>Deadline</label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <button type="submit" className="btn">Add Financial Goal</button>
      </form>

      <div>
        {goals.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#6c757d', padding: '2rem' }}>
            No financial goals set yet. Start planning your financial future!
          </div>
        ) : (
          goals.map(goal => {
            const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
            const remaining = goal.targetAmount - goal.currentAmount;
            const daysRemaining = getDaysRemaining(goal.deadline);
            
            return (
              <div
                key={goal.id}
                style={{
                  background: 'white',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '0.5rem'
                  }}>
                    <h4 style={{ margin: 0, color: '#495057' }}>{goal.title}</h4>
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      style={{
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#6c757d' }}>
                    <span>📁 {goal.category}</span>
                    <span>⏰ {daysRemaining}</span>
                  </div>
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginBottom: '0.5rem' 
                  }}>
                    <span>Progress</span>
                    <span style={{ fontWeight: '500' }}>
                      {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                    </span>
                  </div>
                  
                  <div style={{ 
                    background: '#e9ecef', 
                    height: '15px', 
                    borderRadius: '8px', 
                    overflow: 'hidden',
                    marginBottom: '0.5rem'
                  }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${progress}%`,
                        background: getProgressColor(progress),
                        transition: 'width 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {progress >= 10 && `${progress.toFixed(0)}%`}
                    </div>
                  </div>
                  
                  <div style={{ fontSize: '0.875rem', color: '#6c757d' }}>
                    {progress >= 100 ? (
                      <span style={{ color: '#28a745', fontWeight: '500' }}>🎉 Goal Achieved!</span>
                    ) : (
                      <span>{formatCurrency(remaining)} remaining</span>
                    )}
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="number"
                    placeholder="Add amount"
                    step="0.01"
                    style={{
                      flex: '1',
                      padding: '0.5rem',
                      border: '1px solid #e9ecef',
                      borderRadius: '4px'
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const amount = parseFloat(e.target.value);
                        if (!isNaN(amount) && amount > 0) {
                          updateProgress(goal.id, goal.currentAmount + amount);
                          e.target.value = '';
                        }
                      }
                    }}
                  />
                  <button
                    onClick={(e) => {
                      const input = e.target.previousElementSibling;
                      const amount = parseFloat(input.value);
                      if (!isNaN(amount) && amount > 0) {
                        updateProgress(goal.id, goal.currentAmount + amount);
                        input.value = '';
                      }
                    }}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default FinancialGoals;
