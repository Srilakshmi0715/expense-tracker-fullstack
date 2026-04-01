import React, { useState, useEffect } from 'react';
import TransactionList from '../components/TransactionList';
import TransactionTags from '../components/TransactionTags';

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    // Load transactions from localStorage
    const savedTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    setTransactions(savedTransactions);
  }, []);

  const deleteTransaction = (id) => {
    const newTransactions = transactions.filter(t => t.id !== id);
    setTransactions(newTransactions);
    localStorage.setItem('transactions', JSON.stringify(newTransactions));
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory;
    const matchesType = filterType === 'all' || transaction.type === filterType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <div className="container">
      <section style={{ padding: '2rem' }}>
        <h2 style={{ marginBottom: '2rem', color: '#495057' }}>📜 Transaction History</h2>
        
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginBottom: '2rem', 
          flexWrap: 'wrap' 
        }}>
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: '1',
              minWidth: '200px',
              padding: '0.75rem',
              border: '2px solid #e9ecef',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          />
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{
              padding: '0.75rem',
              border: '2px solid #e9ecef',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          >
            <option value="all">All Categories</option>
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
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{
              padding: '0.75rem',
              border: '2px solid #e9ecef',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <TransactionTags 
            selectedTags={selectedTags} 
            onTagsChange={setSelectedTags} 
          />
        </div>

        <div style={{ 
          background: '#f8f9fa', 
          padding: '1rem', 
          borderRadius: '8px', 
          marginBottom: '1rem' 
        }}>
          <p style={{ margin: 0, color: '#6c757d' }}>
            Showing {filteredTransactions.length} of {transactions.length} transactions
          </p>
        </div>

        <TransactionList 
          transactions={transactions} 
          onDeleteTransaction={deleteTransaction} 
          showFilters={false}
          searchTerm={searchTerm}
          filterCategory={filterCategory}
          filterType={filterType}
          selectedTags={selectedTags}
        />
      </section>
    </div>
  );
};

export default History;
