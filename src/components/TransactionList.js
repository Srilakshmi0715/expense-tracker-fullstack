import React from 'react';

const TransactionList = ({ transactions, onDeleteTransaction, showFilters = true, searchTerm = '', filterCategory = 'all', filterType = 'all', selectedTags = [] }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = !searchTerm || searchTerm === '' || (transaction.description && transaction.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory;
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesTags = !selectedTags || selectedTags.length === 0 || 
      (transaction.tags && selectedTags.some(tag => transaction.tags.includes(tag)));
    
    return matchesSearch && matchesCategory && matchesType && matchesTags;
  });

  if (filteredTransactions.length === 0) {
    return (
      <section style={{ padding: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem', color: '#495057' }}>Transaction History</h3>
        <div style={{ 
          textAlign: 'center', 
          color: '#6c757d', 
          padding: '2rem',
          fontStyle: 'italic',
          background: '#f8f9fa',
          borderRadius: '8px'
        }}>
          No transactions found. Add your first transaction above!
        </div>
      </section>
    );
  }

  return (
    <section style={{ padding: '2rem' }}>
      <h3 style={{ marginBottom: '1.5rem', color: '#495057' }}>Transaction History</h3>
      <div style={{ 
        maxHeight: '400px', 
        overflowY: 'auto',
        background: '#f8f9fa',
        borderRadius: '8px',
        padding: '1rem'
      }}>
        {transactions
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map(transaction => (
            <div
              key={transaction.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                marginBottom: '0.5rem',
                background: 'white',
                borderRadius: '8px',
                borderLeft: `4px solid ${transaction.type === 'income' ? '#28a745' : '#dc3545'}`,
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(5px)';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '500', color: '#495057', marginBottom: '0.25rem' }}>
                  {transaction.description} ({transaction.category})
                  {transaction.tags && transaction.tags.length > 0 && (
                    <span style={{ marginLeft: '0.5rem' }}>
                      {transaction.tags.map(tag => (
                        <span
                          key={tag}
                          style={{
                            display: 'inline-block',
                            padding: '0.125rem 0.375rem',
                            background: '#e9ecef',
                            color: '#495057',
                            borderRadius: '10px',
                            fontSize: '0.75rem',
                            marginLeft: '0.25rem'
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6c757d' }}>
                  {formatDate(transaction.date)}
                </div>
                <div style={{ 
                  fontWeight: 'bold', 
                  fontSize: '1.1rem',
                  color: transaction.type === 'income' ? '#28a745' : '#dc3545'
                }}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </div>
              </div>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this transaction?')) {
                    onDeleteTransaction(transaction.id);
                  }
                }}
                style={{
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  transition: 'background 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#c82333';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#dc3545';
                }}
              >
                Delete
              </button>
            </div>
          ))}
      </div>
    </section>
  );
};

export default TransactionList;
