import React, { useState, useEffect } from 'react';

const RecurringTransactions = ({ onAddRecurringTransaction }) => {
  const [recurringTransactions, setRecurringTransactions] = useState([]);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'bills',
    frequency: 'monthly',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('recurringTransactions') || '[]');
    setRecurringTransactions(saved);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.description || !formData.amount || !formData.startDate) {
      alert('Please fill in all required fields');
      return;
    }

    const newRecurring = {
      id: Date.now(),
      ...formData,
      amount: parseFloat(formData.amount),
      isActive: true,
      createdAt: new Date().toISOString()
    };

    const updated = [...recurringTransactions, newRecurring];
    setRecurringTransactions(updated);
    localStorage.setItem('recurringTransactions', JSON.stringify(updated));
    
    // Reset form
    setFormData({
      description: '',
      amount: '',
      category: 'bills',
      frequency: 'monthly',
      startDate: '',
      endDate: ''
    });
  };

  const toggleActive = (id) => {
    const updated = recurringTransactions.map(t => 
      t.id === id ? { ...t, isActive: !t.isActive } : t
    );
    setRecurringTransactions(updated);
    localStorage.setItem('recurringTransactions', JSON.stringify(updated));
  };

  const deleteRecurring = (id) => {
    if (window.confirm('Are you sure you want to delete this recurring transaction?')) {
      const updated = recurringTransactions.filter(t => t.id !== id);
      setRecurringTransactions(updated);
      localStorage.setItem('recurringTransactions', JSON.stringify(updated));
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <section style={{ 
      padding: '2rem', 
      background: '#f8f9fa', 
      borderTop: '1px solid #e9ecef' 
    }}>
      <h3 style={{ marginBottom: '1.5rem', color: '#495057' }}>🔄 Recurring Transactions</h3>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '1rem', 
          marginBottom: '1rem' 
        }}>
          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g., Netflix subscription"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              required
            />
          </div>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr 1fr', 
          gap: '1rem', 
          marginBottom: '1rem' 
        }}>
          <div className="form-group">
            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="bills">Bills</option>
              <option value="entertainment">Entertainment</option>
              <option value="shopping">Shopping</option>
              <option value="healthcare">Healthcare</option>
              <option value="education">Education</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Frequency</label>
            <select name="frequency" value={formData.frequency} onChange={handleChange}>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <div className="form-group">
            <label>End Date (Optional)</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <button type="submit" className="btn">Add Recurring Transaction</button>
      </form>

      <div>
        {recurringTransactions.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#6c757d', padding: '2rem' }}>
            No recurring transactions set up yet.
          </div>
        ) : (
          recurringTransactions.map(transaction => (
            <div
              key={transaction.id}
              style={{
                background: 'white',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                border: `2px solid ${transaction.isActive ? '#28a745' : '#dc3545'}`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                    {transaction.description}
                  </div>
                  <div style={{ color: '#6c757d', fontSize: '0.875rem' }}>
                    {formatCurrency(transaction.amount)} • {transaction.frequency} • {transaction.category}
                  </div>
                  <div style={{ color: '#6c757d', fontSize: '0.875rem' }}>
                    From: {new Date(transaction.startDate).toLocaleDateString()}
                    {transaction.endDate && ` To: ${new Date(transaction.endDate).toLocaleDateString()}`}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '4px', 
                    fontSize: '0.75rem',
                    background: transaction.isActive ? '#d4edda' : '#f8d7da',
                    color: transaction.isActive ? '#155724' : '#721c24'
                  }}>
                    {transaction.isActive ? 'Active' : 'Paused'}
                  </span>
                  <button
                    onClick={() => toggleActive(transaction.id)}
                    style={{
                      padding: '0.5rem',
                      background: transaction.isActive ? '#ffc107' : '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    {transaction.isActive ? '⏸️' : '▶️'}
                  </button>
                  <button
                    onClick={() => deleteRecurring(transaction.id)}
                    style={{
                      padding: '0.5rem',
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default RecurringTransactions;
