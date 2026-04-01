import React, { useState, useEffect } from 'react';

const TransactionReminders = ({ transactions }) => {
  const [reminders, setReminders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    type: 'recurring',
    frequency: 'monthly',
    amount: '',
    category: 'bills',
    nextDue: '',
    enabled: true
  });

  useEffect(() => {
    const savedReminders = JSON.parse(localStorage.getItem('transactionReminders') || '[]');
    const savedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    setReminders(savedReminders);
    setNotifications(savedNotifications);
    
    // Check for due reminders
    checkDueReminders(savedReminders);
  }, []);

  const checkDueReminders = (reminderList) => {
    const today = new Date();
    const newNotifications = [];
    
    reminderList.forEach(reminder => {
      if (!reminder.enabled) return;
      
      const dueDate = new Date(reminder.nextDue);
      const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
      
      if (daysUntilDue <= 3 && daysUntilDue >= 0) {
        newNotifications.push({
          id: Date.now() + Math.random(),
          type: 'reminder',
          title: reminder.title,
          message: `${reminder.title} is due in ${daysUntilDue} day${daysUntilDue === 1 ? '' : 's'} (${formatCurrency(reminder.amount)})`,
          priority: daysUntilDue === 0 ? 'high' : daysUntilDue === 1 ? 'medium' : 'low',
          date: today.toISOString()
        });
      }
    });
    
    if (newNotifications.length > 0) {
      setNotifications(prev => [...newNotifications, ...prev].slice(0, 10));
      localStorage.setItem('notifications', JSON.stringify([...newNotifications, ...notifications].slice(0, 10)));
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.amount || !formData.nextDue) {
      alert('Please fill in all required fields');
      return;
    }

    const newReminder = {
      id: Date.now(),
      ...formData,
      amount: parseFloat(formData.amount),
      createdAt: new Date().toISOString()
    };

    const updated = [...reminders, newReminder];
    setReminders(updated);
    localStorage.setItem('transactionReminders', JSON.stringify(updated));
    
    // Reset form
    setFormData({
      title: '',
      type: 'recurring',
      frequency: 'monthly',
      amount: '',
      category: 'bills',
      nextDue: '',
      enabled: true
    });
    
    checkDueReminders(updated);
  };

  const toggleReminder = (id) => {
    const updated = reminders.map(r => 
      r.id === id ? { ...r, enabled: !r.enabled } : r
    );
    setReminders(updated);
    localStorage.setItem('transactionReminders', JSON.stringify(updated));
  };

  const deleteReminder = (id) => {
    if (window.confirm('Are you sure you want to delete this reminder?')) {
      const updated = reminders.filter(r => r.id !== id);
      setReminders(updated);
      localStorage.setItem('transactionReminders', JSON.stringify(updated));
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
    localStorage.setItem('notifications', JSON.stringify([]));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#dc3545';
      case 'medium': return '#ffc107';
      case 'low': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  return (
    <section style={{ 
      padding: '2rem', 
      background: '#f8f9fa', 
      borderTop: '1px solid #e9ecef' 
    }}>
      <h3 style={{ marginBottom: '1.5rem', color: '#495057' }}>🔔 Transaction Reminders</h3>
      
      {/* Notifications */}
      {notifications.length > 0 && (
        <div style={{ 
          background: 'white', 
          padding: '1rem', 
          borderRadius: '8px', 
          marginBottom: '2rem',
          border: '1px solid #e9ecef'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <h4 style={{ margin: 0, color: '#495057' }}>📬 Notifications</h4>
            <button
              onClick={clearNotifications}
              style={{
                padding: '0.25rem 0.5rem',
                background: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.75rem'
              }}
            >
              Clear All
            </button>
          </div>
          
          {notifications.map(notification => (
            <div
              key={notification.id}
              style={{
                padding: '0.75rem',
                marginBottom: '0.5rem',
                background: `${getPriorityColor(notification.priority)}15`,
                borderLeft: `4px solid ${getPriorityColor(notification.priority)}`,
                borderRadius: '4px'
              }}
            >
              <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                {notification.title}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6c757d' }}>
                {notification.message}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Add Reminder Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '1rem', 
          marginBottom: '1rem' 
        }}>
          <div className="form-group">
            <label>Reminder Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Rent Payment, Credit Card Bill"
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
            <label>Next Due Date</label>
            <input
              type="date"
              name="nextDue"
              value={formData.nextDue}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <button type="submit" className="btn">Add Reminder</button>
      </form>

      {/* Reminders List */}
      <div>
        {reminders.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#6c757d', padding: '2rem' }}>
            No reminders set up yet.
          </div>
        ) : (
          reminders.map(reminder => {
            const today = new Date();
            const dueDate = new Date(reminder.nextDue);
            const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
            
            return (
              <div
                key={reminder.id}
                style={{
                  background: 'white',
                  padding: '1rem',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  border: `2px solid ${reminder.enabled ? '#28a745' : '#dc3545'}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                      {reminder.title}
                    </div>
                    <div style={{ color: '#6c757d', fontSize: '0.875rem' }}>
                      {formatCurrency(reminder.amount)} • {reminder.frequency} • {reminder.category}
                    </div>
                    <div style={{ color: '#6c757d', fontSize: '0.875rem' }}>
                      Due: {new Date(reminder.nextDue).toLocaleDateString()}
                      {daysUntilDue >= 0 && (
                        <span style={{ 
                          marginLeft: '0.5rem',
                          padding: '0.125rem 0.5rem',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          background: daysUntilDue <= 1 ? '#dc3545' : daysUntilDue <= 3 ? '#ffc107' : '#28a745',
                          color: 'white'
                        }}>
                          {daysUntilDue === 0 ? 'Today' : daysUntilDue === 1 ? 'Tomorrow' : `${daysUntilDue} days`}
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '4px', 
                      fontSize: '0.75rem',
                      background: reminder.enabled ? '#d4edda' : '#f8d7da',
                      color: reminder.enabled ? '#155724' : '#721c24'
                    }}>
                      {reminder.enabled ? 'Active' : 'Paused'}
                    </span>
                    <button
                      onClick={() => toggleReminder(reminder.id)}
                      style={{
                        padding: '0.5rem',
                        background: reminder.enabled ? '#ffc107' : '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      {reminder.enabled ? '⏸️' : '▶️'}
                    </button>
                    <button
                      onClick={() => deleteReminder(reminder.id)}
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
            );
          })
        )}
      </div>
    </section>
  );
};

export default TransactionReminders;
