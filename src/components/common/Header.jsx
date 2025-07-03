import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'user': return '👤';
      case 'ssm': return '👨‍💼';
      case 'gm': return '👑';
      default: return '👤';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'user': return '#3498db';
      case 'ssm': return '#f39c12';
      case 'gm': return '#9b59b6';
      default: return '#3498db';
    }
  };

  return (
    <header className="modern-header">
      <div className="header-content">
        <div className="header-left">
          <div className="logo-section">
            <div className="logo-icon">
              <img src="/indianrailways-whitebg.png" alt="Indian Railways" style={{ height: '1.5em', verticalAlign: 'middle' }} />
            </div>
            <div className="logo-text">
              <h1>Railway Board</h1>
              <span>Letter Monitoring System</span>
            </div>
          </div>
        </div>
        {user && (
          <div className="header-right">
            <div className="user-info">
              <div className="user-avatar" style={{ backgroundColor: getRoleColor(user.role) }}>
                {getRoleIcon(user.role)}
              </div>
              <div className="user-details">
                <span className="username">{user.username}</span>
                <span className="user-role" style={{ color: getRoleColor(user.role) }}>
                  {user.role.toUpperCase()}
                </span>
              </div>
            </div>
            <button className="logout-button" onClick={handleLogout}>
              <span className="logout-icon">🚪</span>
              <span className="logout-text">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;