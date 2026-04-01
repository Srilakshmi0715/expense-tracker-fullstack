import React from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const AdvancedCharts = ({ transactions }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Monthly Trend Chart
  const getMonthlyTrendData = () => {
    const monthlyData = {};
    const currentYear = new Date().getFullYear();
    
    // Initialize all months with 0
    for (let month = 0; month < 12; month++) {
      monthlyData[month] = { income: 0, expense: 0 };
    }
    
    transactions
      .filter(t => new Date(t.date).getFullYear() === currentYear)
      .forEach(transaction => {
        const month = new Date(transaction.date).getMonth();
        if (transaction.type === 'income') {
          monthlyData[month].income += transaction.amount;
        } else {
          monthlyData[month].expense += transaction.amount;
        }
      });
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return {
      labels: monthNames,
      datasets: [
        {
          label: 'Income',
          data: Object.values(monthlyData).map(d => d.income),
          borderColor: '#28a745',
          backgroundColor: 'rgba(40, 167, 69, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Expenses',
          data: Object.values(monthlyData).map(d => d.expense),
          borderColor: '#dc3545',
          backgroundColor: 'rgba(220, 53, 69, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    };
  };

  // Daily Spending Pattern
  const getDailySpendingData = () => {
    const dailyData = {
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
      Saturday: 0,
      Sunday: 0
    };
    
    transactions
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        const dayOfWeek = new Date(transaction.date).toLocaleDateString('en-US', { weekday: 'long' });
        if (dailyData[dayOfWeek] !== undefined) {
          dailyData[dayOfWeek] += transaction.amount;
        }
      });
    
    return {
      labels: Object.keys(dailyData),
      datasets: [
        {
          label: 'Average Daily Spending',
          data: Object.values(dailyData).map(amount => amount / 4), // Average per week
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
            '#FF6384'
          ]
        }
      ]
    };
  };

  // Category Comparison
  const getCategoryComparisonData = () => {
    const categoryData = {};
    
    transactions.forEach(transaction => {
      if (!categoryData[transaction.category]) {
        categoryData[transaction.category] = { income: 0, expense: 0 };
      }
      
      if (transaction.type === 'income') {
        categoryData[transaction.category].income += transaction.amount;
      } else {
        categoryData[transaction.category].expense += transaction.amount;
      }
    });
    
    return {
      labels: Object.keys(categoryData).map(cat => cat.charAt(0).toUpperCase() + cat.slice(1)),
      datasets: [
        {
          label: 'Income',
          data: Object.values(categoryData).map(d => d.income),
          backgroundColor: '#28a745'
        },
        {
          label: 'Expenses',
          data: Object.values(categoryData).map(d => d.expense),
          backgroundColor: '#dc3545'
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            label += formatCurrency(context.parsed.y || context.parsed);
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return formatCurrency(value);
          }
        }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = formatCurrency(context.parsed);
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div style={{ display: 'grid', gap: '2rem' }}>
      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
        <h3 style={{ marginBottom: '1rem', textAlign: 'center' }}>📈 Monthly Trend</h3>
        <Line data={getMonthlyTrendData()} options={chartOptions} />
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
          <h4 style={{ marginBottom: '1rem', textAlign: 'center' }}>📅 Daily Spending Pattern</h4>
          <Pie data={getDailySpendingData()} options={pieOptions} />
        </div>
        
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
          <h4 style={{ marginBottom: '1rem', textAlign: 'center' }}>📊 Category Comparison</h4>
          <Bar data={getCategoryComparisonData()} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default AdvancedCharts;
