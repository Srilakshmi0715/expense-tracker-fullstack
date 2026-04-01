import React from 'react';

const ExportButtons = ({ transactions }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const exportCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    const rows = transactions.map(t => [
      formatDate(t.date),
      t.description,
      t.category,
      t.type,
      t.amount.toFixed(2)
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');
    
    downloadFile(csvContent, 'transactions.csv', 'text/csv');
  };

  const exportJSON = () => {
    const jsonContent = JSON.stringify(transactions, null, 2);
    downloadFile(jsonContent, 'transactions.json', 'application/json');
  };

  const downloadFile = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ 
      display: 'flex', 
      gap: '1rem', 
      justifyContent: 'center',
      marginTop: '2rem'
    }}>
      <button
        onClick={exportCSV}
        style={{
          padding: '0.75rem 1.5rem',
          background: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '0.9rem',
          transition: 'background 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = '#5a6268';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = '#6c757d';
        }}
      >
        📊 Export CSV
      </button>
      
      <button
        onClick={exportJSON}
        style={{
          padding: '0.75rem 1.5rem',
          background: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '0.9rem',
          transition: 'background 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = '#5a6268';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = '#6c757d';
        }}
      >
        📄 Export JSON
      </button>
    </div>
  );
};

export default ExportButtons;
