import React, { useState, useEffect } from 'react';

const Settings = () => {
  const [settings, setSettings] = useState({
    darkMode: false,
    currency: 'USD',
    notifications: true,
    autoBackup: true,
    theme: 'default'
  });

  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem('appSettings') || '{}');
    setSettings({ ...settings, ...savedSettings });
  }, []);

  const handleChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('appSettings', JSON.stringify(newSettings));
    
    // Apply dark mode immediately
    if (key === 'darkMode') {
      document.body.classList.toggle('dark-mode', value);
    }
  };

  const exportAllData = () => {
    const allData = {
      transactions: JSON.parse(localStorage.getItem('transactions') || '[]'),
      budgets: JSON.parse(localStorage.getItem('budgets') || '{}'),
      recurringTransactions: JSON.parse(localStorage.getItem('recurringTransactions') || '[]'),
      financialGoals: JSON.parse(localStorage.getItem('financialGoals') || '[]'),
      transactionTags: JSON.parse(localStorage.getItem('transactionTags') || '[]'),
      settings: settings,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expense-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        // Import all data
        if (data.transactions) localStorage.setItem('transactions', JSON.stringify(data.transactions));
        if (data.budgets) localStorage.setItem('budgets', JSON.stringify(data.budgets));
        if (data.recurringTransactions) localStorage.setItem('recurringTransactions', JSON.stringify(data.recurringTransactions));
        if (data.financialGoals) localStorage.setItem('financialGoals', JSON.stringify(data.financialGoals));
        if (data.transactionTags) localStorage.setItem('transactionTags', JSON.stringify(data.transactionTags));
        if (data.settings) {
          localStorage.setItem('appSettings', JSON.stringify(data.settings));
          setSettings(data.settings);
          document.body.classList.toggle('dark-mode', data.settings.darkMode);
        }
        
        alert('Data imported successfully! Please refresh the page to see changes.');
      } catch (error) {
        alert('Error importing data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      if (window.confirm('This will delete all your transactions, budgets, goals, and settings. Are you absolutely sure?')) {
        localStorage.clear();
        alert('All data cleared successfully. You will be redirected to the login page.');
        window.location.reload();
      }
    }
  };

  return (
    <div className="container">
      <section style={{ padding: '2rem' }}>
        <h2 style={{ marginBottom: '2rem', color: '#495057' }}>⚙️ Settings</h2>
        
        <div style={{ display: 'grid', gap: '2rem' }}>
          {/* Appearance Settings */}
          <div style={{ 
            background: 'white', 
            padding: '1.5rem', 
            borderRadius: '8px', 
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' 
          }}>
            <h3 style={{ marginBottom: '1rem', color: '#495057' }}>🎨 Appearance</h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.darkMode}
                  onChange={(e) => handleChange('darkMode', e.target.checked)}
                  style={{ width: '20px', height: '20px' }}
                />
                <span>Dark Mode</span>
              </label>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Theme
              </label>
              <select
                value={settings.theme}
                onChange={(e) => handleChange('theme', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e9ecef',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
              >
                <option value="default">Default</option>
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="purple">Purple</option>
              </select>
            </div>
          </div>

          {/* Currency Settings */}
          <div style={{ 
            background: 'white', 
            padding: '1.5rem', 
            borderRadius: '8px', 
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' 
          }}>
            <h3 style={{ marginBottom: '1rem', color: '#495057' }}>💱 Currency</h3>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Default Currency
              </label>
              <select
                value={settings.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e9ecef',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="JPY">JPY - Japanese Yen</option>
                <option value="INR">INR - Indian Rupee</option>
                <option value="CAD">CAD - Canadian Dollar</option>
                <option value="AUD">AUD - Australian Dollar</option>
              </select>
            </div>
          </div>

          {/* Notification Settings */}
          <div style={{ 
            background: 'white', 
            padding: '1.5rem', 
            borderRadius: '8px', 
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' 
          }}>
            <h3 style={{ marginBottom: '1rem', color: '#495057' }}>🔔 Notifications</h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={(e) => handleChange('notifications', e.target.checked)}
                  style={{ width: '20px', height: '20px' }}
                />
                <span>Enable Notifications</span>
              </label>
            </div>
            
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.autoBackup}
                  onChange={(e) => handleChange('autoBackup', e.target.checked)}
                  style={{ width: '20px', height: '20px' }}
                />
                <span>Auto Backup Data</span>
              </label>
            </div>
          </div>

          {/* Data Management */}
          <div style={{ 
            background: 'white', 
            padding: '1.5rem', 
            borderRadius: '8px', 
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' 
          }}>
            <h3 style={{ marginBottom: '1rem', color: '#495057' }}>📊 Data Management</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <button
                onClick={exportAllData}
                style={{
                  padding: '0.75rem',
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                📤 Export All Data
              </button>
              
              <label
                style={{
                  padding: '0.75rem',
                  background: '#17a2b8',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  textAlign: 'center',
                  display: 'block'
                }}
              >
                📥 Import Data
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
            
            <button
              onClick={clearAllData}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              🗑️ Clear All Data
            </button>
          </div>

          {/* About */}
          <div style={{ 
            background: 'white', 
            padding: '1.5rem', 
            borderRadius: '8px', 
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' 
          }}>
            <h3 style={{ marginBottom: '1rem', color: '#495057' }}>ℹ️ About</h3>
            
            <div style={{ color: '#6c757d', lineHeight: '1.6' }}>
              <p><strong>Expense Tracker Pro</strong></p>
              <p>Version 2.0.0</p>
              <p>A comprehensive expense tracking application with advanced features for personal finance management.</p>
              <p style={{ marginTop: '1rem' }}>
                <strong>Features:</strong>
              </p>
              <ul style={{ marginLeft: '1.5rem' }}>
                <li>Transaction tracking with tags</li>
                <li>Recurring transactions</li>
                <li>Financial goals tracking</li>
                <li>Advanced analytics and reports</li>
                <li>Multi-currency support</li>
                <li>Budget management</li>
                <li>Data export/import</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Settings;
