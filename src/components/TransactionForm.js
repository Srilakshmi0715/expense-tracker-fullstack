import React, { useState } from 'react';
import TransactionTags from './TransactionTags';

const TransactionForm = ({ onAddTransaction }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: 'food',
    tags: []
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.description.trim() || !formData.amount) {
      alert('Please fill in all fields');
      return;
    }

    const transaction = {
      ...formData,
      amount: parseFloat(formData.amount),
      date: new Date().toISOString()
    };

    onAddTransaction(transaction);
    
    // Reset form
    setFormData({
      description: '',
      amount: '',
      type: 'expense',
      category: 'food',
      tags: []
    });
  };

  return (
    <section style={{ padding: '2rem', background: '#f8f9fa', borderTop: '1px solid #e9ecef' }}>
      <h3 style={{ marginBottom: '1.5rem', color: '#495057' }}>Add New Transaction</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description..."
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter amount..."
              step="0.01"
              required
            />
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="form-group">
            <label htmlFor="type">Type</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="food">Food</option>
              <option value="transport">Transport</option>
              <option value="entertainment">Entertainment</option>
              <option value="shopping">Shopping</option>
              <option value="bills">Bills</option>
              <option value="healthcare">Healthcare</option>
              <option value="education">Education</option>
              <option value="salary">Salary</option>
              <option value="business">Business</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <TransactionTags 
            selectedTags={formData.tags} 
            onTagsChange={(tags) => setFormData({ ...formData, tags })} 
          />
        </div>
        
        <button type="submit" className="btn">Add Transaction</button>
      </form>
    </section>
  );
};

export default TransactionForm;
