import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ user }) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { path: '/', icon: '🏠', label: 'Home' }
  ];

  const quickActions = [
    { icon: '➕', label: 'Add Transaction', action: 'add-transaction' },
    { icon: '🔄', label: 'Recurring', action: 'recurring' },
    { icon: '🎯', label: 'Goals', action: 'goals' },
    { icon: '💱', label: 'Converter', action: 'converter' }
  ];

  const handleQuickAction = (action) => {
    const element = document.getElementById(action);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{
      width: isCollapsed ? '80px' : '280px',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#ffffff',
      position: 'fixed',
      left: 0,
      top: 0,
      transition: 'width 0.3s ease',
      zIndex: 1000,
      overflow: 'hidden',
      boxShadow: '2px 0 15px rgba(0, 0, 0, 0.1)'
    }}>
      {/* Sidebar Header */}
      <div style={{
        padding: '1.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {!isCollapsed && (
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>
              💰 Expense Tracker
            </h3>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', opacity: 0.8 }}>
              {user?.name || user?.email}
            </p>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            background: 'none',
            border: 'none',
            color: '#ffffff',
            fontSize: '1.5rem',
            cursor: 'pointer',
            padding: '0.5rem',
            borderRadius: '4px',
            transition: 'background 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'none';
          }}
        >
          {isCollapsed ? '☰' : '◀'}
        </button>
      </div>

      {/* Navigation Menu */}
      <div style={{ padding: '1rem 0' }}>
        {!isCollapsed && (
          <h4 style={{ 
            padding: '0 1.5rem', 
            margin: '0 0 1rem 0', 
            fontSize: '0.875rem', 
            opacity: 0.7,
            textTransform: 'uppercase'
          }}>
            Navigation
          </h4>
        )}
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: isCollapsed ? '1rem' : '0.75rem 1.5rem',
              color: location.pathname === item.path ? '#ffffff' : 'rgba(255, 255, 255, 0.8)',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              borderLeft: location.pathname === item.path ? '4px solid #ffffff' : '4px solid transparent',
              cursor: 'pointer',
              background: location.pathname === item.path ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
            }}
            onMouseEnter={(e) => {
              if (location.pathname !== item.path) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.paddingLeft = isCollapsed ? '1.5rem' : '2rem';
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== item.path) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.paddingLeft = isCollapsed ? '1rem' : '1.5rem';
              }
            }}
          >
            <span style={{ fontSize: '1.25rem', marginRight: isCollapsed ? '0' : '1rem' }}>
              {item.icon}
            </span>
            {!isCollapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ padding: '1rem 0', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        {!isCollapsed && (
          <h4 style={{ 
            padding: '0 1.5rem', 
            margin: '0 0 1rem 0', 
            fontSize: '0.875rem', 
            opacity: 0.7,
            textTransform: 'uppercase'
          }}>
            Quick Actions
          </h4>
        )}
        {quickActions.map((action) => (
          <button
            key={action.action}
            onClick={() => handleQuickAction(action.action)}
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              padding: isCollapsed ? '1rem' : '0.75rem 1.5rem',
              background: 'none',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.8)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '0.9rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.paddingLeft = isCollapsed ? '1.5rem' : '2rem';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'none';
              e.currentTarget.style.paddingLeft = isCollapsed ? '1rem' : '1.5rem';
            }}
            title={isCollapsed ? action.label : ''}
          >
            <span style={{ fontSize: '1.25rem', marginRight: isCollapsed ? '0' : '1rem' }}>
              {action.icon}
            </span>
            {!isCollapsed && <span>{action.label}</span>}
          </button>
        ))}
      </div>

      {/* Summary Stats */}
      {!isCollapsed && (
        <div style={{ 
          padding: '1.5rem', 
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          marginTop: 'auto'
        }}>
          <h4 style={{ 
            margin: '0 0 1rem 0', 
            fontSize: '0.875rem', 
            opacity: 0.7,
            textTransform: 'uppercase'
          }}>
            Quick Stats
          </h4>
          <div style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
            <div style={{ marginBottom: '0.5rem' }}>
              <span style={{ opacity: 0.7 }}>This Month:</span>
              <span style={{ float: 'right', fontWeight: 'bold' }}>+$2,450</span>
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <span style={{ opacity: 0.7 }}>Expenses:</span>
              <span style={{ float: 'right', fontWeight: 'bold', color: '#e74c3c' }}>$1,230</span>
            </div>
            <div>
              <span style={{ opacity: 0.7 }}>Balance:</span>
              <span style={{ float: 'right', fontWeight: 'bold', color: '#27ae60' }}>$1,220</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
