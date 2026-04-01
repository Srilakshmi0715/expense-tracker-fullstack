import React, { useState, useEffect } from 'react';

const ExpenseSharing = ({ transactions }) => {
  const [sharedExpenses, setSharedExpenses] = useState([]);
  const [formData, setFormData] = useState({
    description: '',
    totalAmount: '',
    category: 'entertainment',
    date: new Date().toISOString().split('T')[0],
    participants: [],
    splitType: 'equal' // equal, custom, percentage
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('sharedExpenses') || '[]');
    setSharedExpenses(saved);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const addParticipant = () => {
    setFormData({
      ...formData,
      participants: [...formData.participants, { name: '', amount: '', percentage: '' }]
    });
  };

  const removeParticipant = (index) => {
    const updated = formData.participants.filter((_, i) => i !== index);
    setFormData({ ...formData, participants: updated });
  };

  const updateParticipant = (index, field, value) => {
    const updated = formData.participants.map((p, i) => 
      i === index ? { ...p, [field]: value } : p
    );
    setFormData({ ...formData, participants: updated });
  };

  const calculateShares = () => {
    const total = parseFloat(formData.totalAmount) || 0;
    const participantCount = formData.participants.length;
    
    if (formData.splitType === 'equal' && participantCount > 0) {
      const equalShare = total / participantCount;
      return formData.participants.map(p => ({ ...p, amount: equalShare.toFixed(2) }));
    }
    
    return formData.participants;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.description || !formData.totalAmount || formData.participants.length === 0) {
      alert('Please fill in all required fields and add at least one participant');
      return;
    }

    const shares = calculateShares();
    const sharedExpense = {
      id: Date.now(),
      ...formData,
      totalAmount: parseFloat(formData.totalAmount),
      participants: shares,
      createdAt: new Date().toISOString()
    };

    const updated = [...sharedExpenses, sharedExpense];
    setSharedExpenses(updated);
    localStorage.setItem('sharedExpenses', JSON.stringify(updated));
    
    // Reset form
    setFormData({
      description: '',
      totalAmount: '',
      category: 'entertainment',
      date: new Date().toISOString().split('T')[0],
      participants: [],
      splitType: 'equal'
    });
  };

  const deleteSharedExpense = (id) => {
    if (window.confirm('Are you sure you want to delete this shared expense?')) {
      const updated = sharedExpenses.filter(e => e.id !== id);
      setSharedExpenses(updated);
      localStorage.setItem('sharedExpenses', JSON.stringify(updated));
    }
  };

  const settleExpense = (id, participantIndex) => {
    const updated = sharedExpenses.map(expense => {
      if (expense.id === id) {
        const updatedParticipants = expense.participants.map((p, i) => 
          i === participantIndex ? { ...p, settled: true } : p
        );
        return { ...expense, participants: updatedParticipants };
      }
      return expense;
    });
    
    setSharedExpenses(updated);
    localStorage.setItem('sharedExpenses', JSON.stringify(updated));
  };

  return (
    <section style={{ 
      padding: '2rem', 
      background: '#f8f9fa', 
      borderTop: '1px solid #e9ecef' 
    }}>
      <h3 style={{ marginBottom: '1.5rem', color: '#495057' }}>👥 Expense Sharing</h3>
      
      {/* Add Shared Expense Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr 1fr', 
          gap: '1rem', 
          marginBottom: '1rem' 
        }}>
          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g., Dinner with friends"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Total Amount</label>
            <input
              type="number"
              name="totalAmount"
              value={formData.totalAmount}
              onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
              placeholder="0.00"
              step="0.01"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Category</label>
            <select 
              value={formData.category} 
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="entertainment">Entertainment</option>
              <option value="food">Food</option>
              <option value="transport">Transport</option>
              <option value="shopping">Shopping</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '1rem', 
          marginBottom: '1rem' 
        }}>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Split Type</label>
            <select 
              value={formData.splitType} 
              onChange={(e) => setFormData({ ...formData, splitType: e.target.value })}
            >
              <option value="equal">Equal Split</option>
              <option value="custom">Custom Amounts</option>
              <option value="percentage">Percentage Split</option>
            </select>
          </div>
        </div>
        
        {/* Participants */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <label style={{ fontWeight: '500' }}>Participants</label>
            <button
              type="button"
              onClick={addParticipant}
              style={{
                padding: '0.5rem 1rem',
                background: '#17a2b8',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              + Add Participant
            </button>
          </div>
          
          {formData.participants.map((participant, index) => (
            <div
              key={index}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr auto',
                gap: '0.5rem',
                marginBottom: '0.5rem',
                alignItems: 'center'
              }}
            >
              <input
                type="text"
                placeholder="Name"
                value={participant.name}
                onChange={(e) => updateParticipant(index, 'name', e.target.value)}
                style={{
                  padding: '0.5rem',
                  border: '1px solid #e9ecef',
                  borderRadius: '4px'
                }}
                required
              />
              
              {formData.splitType === 'equal' ? (
                <input
                  type="text"
                  value={formData.totalAmount ? formatCurrency(parseFloat(formData.totalAmount) / formData.participants.length) : '$0.00'}
                  disabled
                  style={{
                    padding: '0.5rem',
                    border: '1px solid #e9ecef',
                    borderRadius: '4px',
                    background: '#f8f9fa'
                  }}
                />
              ) : formData.splitType === 'custom' ? (
                <input
                  type="number"
                  placeholder="Amount"
                  value={participant.amount}
                  onChange={(e) => updateParticipant(index, 'amount', e.target.value)}
                  style={{
                    padding: '0.5rem',
                    border: '1px solid #e9ecef',
                    borderRadius: '4px'
                  }}
                />
              ) : (
                <input
                  type="number"
                  placeholder="%"
                  value={participant.percentage}
                  onChange={(e) => updateParticipant(index, 'percentage', e.target.value)}
                  style={{
                    padding: '0.5rem',
                    border: '1px solid #e9ecef',
                    borderRadius: '4px'
                  }}
                />
              )}
              
              <button
                type="button"
                onClick={() => removeParticipant(index)}
                style={{
                  padding: '0.5rem',
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        
        <button type="submit" className="btn">Create Shared Expense</button>
      </form>

      {/* Shared Expenses List */}
      <div>
        {sharedExpenses.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#6c757d', padding: '2rem' }}>
            No shared expenses created yet.
          </div>
        ) : (
          sharedExpenses.map(expense => (
            <div
              key={expense.id}
              style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#495057' }}>
                  {expense.description}
                </h4>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#6c757d' }}>
                  <span>📁 {expense.category}</span>
                  <span>📅 {new Date(expense.date).toLocaleDateString()}</span>
                  <span>💰 {formatCurrency(expense.totalAmount)}</span>
                  <span>👥 {expense.participants.length} people</span>
                </div>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <h5 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#495057' }}>
                  Split Details:
                </h5>
                {expense.participants.map((participant, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.5rem',
                      background: participant.settled ? '#d4edda' : '#f8f9fa',
                      borderRadius: '4px',
                      marginBottom: '0.25rem'
                    }}
                  >
                    <span>{participant.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: '500' }}>
                        {formatCurrency(participant.amount)}
                      </span>
                      <span style={{ 
                        padding: '0.125rem 0.5rem',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        background: participant.settled ? '#28a745' : '#ffc107',
                        color: 'white'
                      }}>
                        {participant.settled ? 'Settled' : 'Pending'}
                      </span>
                      {!participant.settled && (
                        <button
                          onClick={() => settleExpense(expense.id, index)}
                          style={{
                            padding: '0.25rem 0.5rem',
                            background: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.75rem'
                          }}
                        >
                          Settle
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => deleteSharedExpense(expense.id)}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                Delete Expense
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default ExpenseSharing;
