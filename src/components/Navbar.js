import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          💰 Expense Tracker
        </Link>
        <ul className="nav-links">
          <li>
            <Link to="/" className="nav-link">
              🏠 Home
            </Link>
          </li>
          <li>
            <Link to="/reports" className="nav-link">
              📊 Reports
            </Link>
          </li>
          <li>
            <Link to="/history" className="nav-link">
              📜 History
            </Link>
          </li>
          <li>
            <Link to="/settings" className="nav-link">
              ⚙️ Settings
            </Link>
          </li>
          <li>
            <span className="nav-link">
              👤 {user?.name || user?.email}
            </span>
          </li>
          <li>
            <button className="logout-btn" onClick={handleLogout}>
              🚪 Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
