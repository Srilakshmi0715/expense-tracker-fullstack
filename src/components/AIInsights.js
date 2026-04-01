import React, { useState, useEffect } from 'react';

const AIInsights = ({ transactions }) => {
  const [insights, setInsights] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (transactions.length > 0) {
      generateInsights();
      generatePredictions();
      generateRecommendations();
    }
  }, [transactions]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const generateInsights = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const currentMonthTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const lastMonthTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === (currentMonth - 1) && date.getFullYear() === currentYear;
    });

    const currentMonthSpending = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const lastMonthSpending = lastMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const spendingChange = lastMonthSpending > 0 ? 
      ((currentMonthSpending - lastMonthSpending) / lastMonthSpending) * 100 : 0;

    // Category insights
    const categorySpending = {};
    currentMonthTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
      });

    const topCategory = Object.entries(categorySpending)
      .sort(([,a], [,b]) => b - a)[0];

    const newInsights = [
      {
        type: 'spending_trend',
        title: 'Monthly Spending Trend',
        message: `Your spending changed by ${spendingChange.toFixed(1)}% compared to last month`,
        value: spendingChange,
        positive: spendingChange < 0,
        icon: spendingChange < 0 ? '📉' : '📈'
      },
      {
        type: 'top_category',
        title: 'Highest Spending Category',
        message: `${topCategory ? topCategory[0].charAt(0).toUpperCase() + topCategory[0].slice(1) : 'N/A'} with ${formatCurrency(topCategory ? topCategory[1] : 0)}`,
        value: topCategory ? topCategory[1] : 0,
        positive: false,
        icon: '🏷️'
      },
      {
        type: 'transaction_count',
        title: 'Transaction Activity',
        message: `${currentMonthTransactions.length} transactions this month`,
        value: currentMonthTransactions.length,
        positive: true,
        icon: '📊'
      }
    ];

    setInsights(newInsights);
  };

  const generatePredictions = () => {
    const monthlyData = {};
    
    // Organize data by month
    transactions.forEach(t => {
      if (t.type === 'expense') {
        const monthKey = t.date.substring(0, 7); // YYYY-MM
        monthlyData[monthKey] = (monthlyData[monthKey] || 0) + t.amount;
      }
    });

    const months = Object.keys(monthlyData).sort();
    if (months.length < 2) return;

    // Simple linear regression for prediction
    const n = months.length;
    const xSum = months.reduce((sum, month, index) => sum + index, 0);
    const ySum = months.reduce((sum, month) => sum + monthlyData[month], 0);
    const xySum = months.reduce((sum, month, index) => sum + index * monthlyData[month], 0);
    const x2Sum = months.reduce((sum, month, index) => sum + index * index, 0);

    const slope = (n * xySum - xSum * ySum) / (n * x2Sum - xSum * xSum);
    const intercept = (ySum - slope * xSum) / n;

    // Predict next month
    const nextMonthPrediction = slope * n + intercept;
    const nextMonthDate = new Date();
    nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
    const nextMonthName = nextMonthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const newPredictions = [
      {
        type: 'spending_prediction',
        title: 'Next Month Prediction',
        message: `Predicted spending for ${nextMonthName}`,
        value: Math.max(0, nextMonthPrediction),
        confidence: Math.max(0, Math.min(100, (1 - Math.abs(slope) / 1000) * 100)),
        icon: '🔮'
      },
      {
        type: 'budget_alert',
        title: 'Budget Alert',
        message: 'Based on current trends, consider reviewing your budget',
        value: nextMonthPrediction,
        positive: nextMonthPrediction < 2000,
        icon: nextMonthPrediction < 2000 ? '✅' : '⚠️'
      }
    ];

    setPredictions(newPredictions);
  };

  const generateRecommendations = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const currentMonthTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    // Analyze spending patterns
    const categorySpending = {};
    currentMonthTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
      });

    const totalSpending = Object.values(categorySpending).reduce((sum, amount) => sum + amount, 0);

    const newRecommendations = [];

    // High spending category warning
    const highSpendingCategories = Object.entries(categorySpending)
      .filter(([, amount]) => amount > totalSpending * 0.3);

    if (highSpendingCategories.length > 0) {
      newRecommendations.push({
        type: 'high_spending',
        title: 'High Spending Alert',
        message: `${highSpendingCategories[0][0]} represents ${((highSpendingCategories[0][1] / totalSpending) * 100).toFixed(1)}% of your spending`,
        priority: 'high',
        icon: '⚠️'
      });
    }

    // Savings recommendation
    const income = currentMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const savingsRate = income > 0 ? ((income - totalSpending) / income) * 100 : 0;

    if (savingsRate < 20) {
      newRecommendations.push({
        type: 'savings',
        title: 'Savings Recommendation',
        message: `Your savings rate is ${savingsRate.toFixed(1)}%. Consider aiming for at least 20%`,
        priority: 'medium',
        icon: '💰'
      });
    }

    // Frequent small transactions
    const smallTransactions = currentMonthTransactions
      .filter(t => t.type === 'expense' && t.amount < 10);

    if (smallTransactions.length > 10) {
      newRecommendations.push({
        type: 'small_transactions',
        title: 'Frequent Small Purchases',
        message: `You made ${smallTransactions.length} small purchases. Consider bundling or reviewing these expenses`,
        priority: 'low',
        icon: '☕'
      });
    }

    // Positive reinforcement
    if (savingsRate >= 20) {
      newRecommendations.push({
        type: 'positive',
        title: 'Great Job!',
        message: `Your savings rate is ${savingsRate.toFixed(1)}% - keep up the good work!`,
        priority: 'positive',
        icon: '🎉'
      });
    }

    setRecommendations(newRecommendations);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#dc3545';
      case 'medium': return '#ffc107';
      case 'low': return '#17a2b8';
      case 'positive': return '#28a745';
      default: return '#6c757d';
    }
  };

  return (
    <section style={{ 
      padding: '2rem', 
      background: '#f8f9fa', 
      borderTop: '1px solid #e9ecef' 
    }}>
      <h3 style={{ marginBottom: '1.5rem', color: '#495057' }}>🤖 AI-Powered Insights</h3>
      
      {transactions.length < 3 ? (
        <div style={{ 
          textAlign: 'center', 
          color: '#6c757d', 
          padding: '2rem',
          background: 'white',
          borderRadius: '8px'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📊</div>
          <p>Add more transactions to see AI-powered insights and predictions</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '2rem' }}>
          {/* Insights Section */}
          <div>
            <h4 style={{ marginBottom: '1rem', color: '#495057' }}>📈 Spending Insights</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              {insights.map((insight, index) => (
                <div
                  key={index}
                  style={{
                    background: 'white',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid #e9ecef',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>{insight.icon}</span>
                    <h5 style={{ margin: 0, color: '#495057' }}>{insight.title}</h5>
                  </div>
                  <p style={{ margin: '0.5rem 0', color: '#6c757d', fontSize: '0.875rem' }}>
                    {insight.message}
                  </p>
                  <div style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: 'bold',
                    color: insight.positive ? '#28a745' : '#dc3545'
                  }}>
                    {typeof insight.value === 'number' ? 
                      (insight.type === 'spending_trend' ? `${insight.value.toFixed(1)}%` : formatCurrency(insight.value)) :
                      insight.value
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Predictions Section */}
          <div>
            <h4 style={{ marginBottom: '1rem', color: '#495057' }}>🔮 Predictions</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              {predictions.map((prediction, index) => (
                <div
                  key={index}
                  style={{
                    background: 'white',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid #e9ecef',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>{prediction.icon}</span>
                    <h5 style={{ margin: 0, color: '#495057' }}>{prediction.title}</h5>
                  </div>
                  <p style={{ margin: '0.5rem 0', color: '#6c757d', fontSize: '0.875rem' }}>
                    {prediction.message}
                  </p>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#495057' }}>
                    {formatCurrency(prediction.value)}
                  </div>
                  {prediction.confidence && (
                    <div style={{ 
                      marginTop: '0.5rem',
                      fontSize: '0.75rem',
                      color: '#6c757d'
                    }}>
                      Confidence: {prediction.confidence.toFixed(1)}%
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations Section */}
          <div>
            <h4 style={{ marginBottom: '1rem', color: '#495057' }}>💡 Recommendations</h4>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {recommendations.map((rec, index) => (
                <div
                  key={index}
                  style={{
                    background: 'white',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: `1px solid ${getPriorityColor(rec.priority)}`,
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
                    borderLeft: `4px solid ${getPriorityColor(rec.priority)}`
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>{rec.icon}</span>
                    <h5 style={{ margin: 0, color: '#495057' }}>{rec.title}</h5>
                  </div>
                  <p style={{ margin: '0', color: '#6c757d', fontSize: '0.875rem' }}>
                    {rec.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AIInsights;
