import React, { useState, useEffect } from 'react';

const CurrencyConverter = ({ amount, onCurrencyChange }) => {
  const [currencies, setCurrencies] = useState([
    { code: 'USD', symbol: '$', rate: 1 },
    { code: 'EUR', symbol: '€', rate: 0.85 },
    { code: 'GBP', symbol: '£', rate: 0.73 },
    { code: 'JPY', symbol: '¥', rate: 110.21 },
    { code: 'INR', symbol: '₹', rate: 74.52 },
    { code: 'CAD', symbol: 'C$', rate: 1.25 },
    { code: 'AUD', symbol: 'A$', rate: 1.35 }
  ]);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [convertedAmount, setConvertedAmount] = useState(amount);

  useEffect(() => {
    const currency = currencies.find(c => c.code === selectedCurrency);
    if (currency) {
      setConvertedAmount(amount * currency.rate);
      onCurrencyChange?.(selectedCurrency, currency.rate);
    }
  }, [amount, selectedCurrency, currencies, onCurrencyChange]);

  const formatCurrency = (amount, code) => {
    const currency = currencies.find(c => c.code === code);
    if (!currency) return amount.toFixed(2);
    
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: code,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    } catch {
      return `${currency.symbol}${amount.toFixed(2)}`;
    }
  };

  return (
    <div style={{ 
      background: 'white', 
      padding: '1.5rem', 
      borderRadius: '8px', 
      marginBottom: '1rem',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
    }}>
      <h4 style={{ marginBottom: '1rem', color: '#495057' }}>💱 Currency Converter</h4>
      
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Display Currency
        </label>
        <select
          value={selectedCurrency}
          onChange={(e) => setSelectedCurrency(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '2px solid #e9ecef',
            borderRadius: '6px',
            fontSize: '1rem'
          }}
        >
          {currencies.map(currency => (
            <option key={currency.code} value={currency.code}>
              {currency.code} - {currency.symbol}
            </option>
          ))}
        </select>
      </div>
      
      <div style={{ 
        background: '#f8f9fa', 
        padding: '1rem', 
        borderRadius: '6px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '0.875rem', color: '#6c757d', marginBottom: '0.5rem' }}>
          {formatCurrency(amount, 'USD')} USD =
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#495057' }}>
          {formatCurrency(convertedAmount, selectedCurrency)}
        </div>
      </div>
      
      <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#6c757d' }}>
        <strong>Exchange Rates:</strong>
        <div style={{ marginTop: '0.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem' }}>
          {currencies.slice(0, 6).map(currency => (
            <div key={currency.code}>
              1 USD = {currency.rate.toFixed(2)} {currency.code}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
