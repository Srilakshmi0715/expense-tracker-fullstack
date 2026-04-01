import React, { useState } from 'react';

const DataImporter = ({ onImport }) => {
  const [importData, setImportData] = useState('');
  const [importType, setImportType] = useState('csv');
  const [isProcessing, setIsProcessing] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const parseCSV = (csvText) => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('CSV file must have at least a header and one data row');
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const transactions = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      
      if (values.length !== headers.length) {
        continue; // Skip malformed rows
      }

      const transaction = {
        id: Date.now() + i,
        description: values[headers.indexOf('description')] || values[headers.indexOf('desc')] || 'Imported Transaction',
        amount: parseFloat(values[headers.indexOf('amount')] || values[headers.indexOf('value')] || '0'),
        type: values[headers.indexOf('type')] || (parseFloat(values[headers.indexOf('amount')] || '0') >= 0 ? 'income' : 'expense'),
        category: values[headers.indexOf('category')] || 'other',
        date: values[headers.indexOf('date')] || new Date().toISOString().split('T')[0],
        tags: values[headers.indexOf('tags')] ? values[headers.indexOf('tags')].split(';').map(t => t.trim()) : []
      };

      if (transaction.amount !== 0) {
        transactions.push(transaction);
      }
    }

    return transactions;
  };

  const parseJSON = (jsonText) => {
    try {
      const data = JSON.parse(jsonText);
      
      if (Array.isArray(data)) {
        return data.map((item, index) => ({
          id: Date.now() + index,
          description: item.description || item.desc || 'Imported Transaction',
          amount: parseFloat(item.amount || item.value || 0),
          type: item.type || (parseFloat(item.amount || item.value || 0) >= 0 ? 'income' : 'expense'),
          category: item.category || 'other',
          date: item.date || new Date().toISOString().split('T')[0],
          tags: item.tags ? (Array.isArray(item.tags) ? item.tags : item.tags.split(';')) : []
        })).filter(t => t.amount !== 0);
      } else {
        throw new Error('JSON data must be an array');
      }
    } catch (error) {
      throw new Error(`Invalid JSON format: ${error.message}`);
    }
  };

  const handleImport = () => {
    if (!importData.trim()) {
      alert('Please enter data to import');
      return;
    }

    setIsProcessing(true);

    try {
      let transactions = [];
      
      if (importType === 'csv') {
        transactions = parseCSV(importData);
      } else if (importType === 'json') {
        transactions = parseJSON(importData);
      }

      if (transactions.length === 0) {
        alert('No valid transactions found in the data');
        setIsProcessing(false);
        return;
      }

      onImport(transactions);
      setImportData('');
      alert(`Successfully imported ${transactions.length} transactions!`);
      
    } catch (error) {
      alert(`Import error: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateSampleCSV = () => {
    const sampleCSV = `description,amount,type,category,date,tags
Coffee Shop,4.50,expense,food,2024-01-15,food;morning
Salary Payment,3000,income,salary,2024-01-01,salary;monthly
Netflix Subscription,15.99,expense,entertainment,2024-01-10,subscription;entertainment
Grocery Shopping,125.30,expense,food,2024-01-12,groceries;essentials`;
    
    setImportData(sampleCSV);
    setImportType('csv');
  };

  const generateSampleJSON = () => {
    const sampleJSON = [
      {
        description: "Coffee Shop",
        amount: 4.50,
        type: "expense",
        category: "food",
        date: "2024-01-15",
        tags: ["food", "morning"]
      },
      {
        description: "Salary Payment",
        amount: 3000,
        type: "income",
        category: "salary",
        date: "2024-01-01",
        tags: ["salary", "monthly"]
      }
    ];
    
    setImportData(JSON.stringify(sampleJSON, null, 2));
    setImportType('json');
  };

  return (
    <section style={{ 
      padding: '2rem', 
      background: '#f8f9fa', 
      borderTop: '1px solid #e9ecef' 
    }}>
      <h3 style={{ marginBottom: '1.5rem', color: '#495057' }}>📥 Import Transaction Data</h3>
      
      {/* Import Type Selection */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ marginRight: '1rem', fontWeight: '500' }}>Import Format:</label>
        <select
          value={importType}
          onChange={(e) => setImportType(e.target.value)}
          style={{
            padding: '0.5rem 1rem',
            border: '2px solid #e9ecef',
            borderRadius: '6px',
            fontSize: '1rem',
            marginRight: '1rem'
          }}
        >
          <option value="csv">CSV</option>
          <option value="json">JSON</option>
        </select>
        
        <button
          onClick={generateSampleCSV}
          style={{
            padding: '0.5rem 1rem',
            background: '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.875rem',
            marginRight: '0.5rem'
          }}
        >
          Load Sample CSV
        </button>
        
        <button
          onClick={generateSampleJSON}
          style={{
            padding: '0.5rem 1rem',
            background: '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.875rem'
          }}
        >
          Load Sample JSON
        </button>
      </div>

      {/* Data Input */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          {importType === 'csv' ? 'CSV Data' : 'JSON Data'}
        </label>
        <textarea
          value={importData}
          onChange={(e) => setImportData(e.target.value)}
          placeholder={importType === 'csv' 
            ? 'description,amount,type,category,date,tags\nCoffee Shop,4.50,expense,food,2024-01-15,food;morning'
            : '[{"description": "Coffee Shop", "amount": 4.50, "type": "expense", "category": "food", "date": "2024-01-15", "tags": ["food", "morning"]}]'
          }
          style={{
            width: '100%',
            height: '200px',
            padding: '1rem',
            border: '2px solid #e9ecef',
            borderRadius: '6px',
            fontSize: '0.875rem',
            fontFamily: importType === 'json' ? 'monospace' : 'inherit',
            resize: 'vertical'
          }}
        />
      </div>

      {/* Format Instructions */}
      <div style={{ 
        background: 'white', 
        padding: '1rem', 
        borderRadius: '6px', 
        marginBottom: '1rem',
        border: '1px solid #e9ecef'
      }}>
        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#495057' }}>
          Format Instructions:
        </h4>
        {importType === 'csv' ? (
          <div style={{ fontSize: '0.875rem', color: '#6c757d', lineHeight: '1.5' }}>
            <p><strong>Required columns:</strong> description, amount, type, category, date</p>
            <p><strong>Optional columns:</strong> tags (semicolon-separated)</p>
            <p><strong>Types:</strong> "income" or "expense"</p>
            <p><strong>Date format:</strong> YYYY-MM-DD</p>
            <p><strong>Tags:</strong> Multiple tags separated by semicolon (;)</p>
          </div>
        ) : (
          <div style={{ fontSize: '0.875rem', color: '#6c757d', lineHeight: '1.5' }}>
            <p><strong>Required fields:</strong> description, amount, type, category, date</p>
            <p><strong>Optional fields:</strong> tags (array)</p>
            <p><strong>Types:</strong> "income" or "expense"</p>
            <p><strong>Date format:</strong> YYYY-MM-DD</p>
            <p><strong>Tags:</strong> Array of strings</p>
          </div>
        )}
      </div>

      {/* Import Button */}
      <button
        onClick={handleImport}
        disabled={isProcessing || !importData.trim()}
        style={{
          padding: '0.75rem 2rem',
          background: isProcessing ? '#6c757d' : '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: isProcessing ? 'not-allowed' : 'pointer',
          fontSize: '1rem',
          fontWeight: '500'
        }}
      >
        {isProcessing ? 'Processing...' : 'Import Transactions'}
      </button>

      {/* File Upload Alternative */}
      <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #e9ecef' }}>
        <h4 style={{ marginBottom: '1rem', color: '#495057' }}>Or Upload File:</h4>
        <input
          type="file"
          accept={importType === 'csv' ? '.csv' : '.json'}
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (event) => {
                setImportData(event.target.result);
              };
              reader.readAsText(file);
            }
          }}
          style={{
            padding: '0.5rem',
            border: '2px solid #e9ecef',
            borderRadius: '6px',
            fontSize: '0.875rem'
          }}
        />
      </div>
    </section>
  );
};

export default DataImporter;
