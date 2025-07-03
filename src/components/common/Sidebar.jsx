import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = ({ setActiveTab, activeTab }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  let dashboardTitle = '';
  if (user?.role === 'gm') dashboardTitle = 'GM Dashboard';
  else if (user?.role === 'ssm') dashboardTitle = 'SSM Dashboard';
  else dashboardTitle = 'User Dashboard';

  const getMenuItems = () => {
    if (!user) return [];

    switch (user.role) {
      case 'user':
        return [
          { label: '📥 Inbox', action: 'inbox', path: '/dashboard' }
        ];
      case 'ssm':
        return [
          { label: '📥 Inbox', action: 'inbox' },
          { label: '📁 Closed', action: 'closed' },
          { label: '➕ Add New', action: 'add-new' },
          { label: '👥 Manage Users', action: 'manage-users' },
          { label: '🔒 Change Password', action: 'change-password' },
          { label: '📊 Reports', action: 'reports' }
        ];
      case 'gm':
        return [
          { label: '📥 Inbox', action: 'inbox' },
          { label: '📁 Closed', action: 'closed' },
          { label: '🔒 Change Password', action: 'change-password' },
          { label: '📊 Reports', action: 'reports' }
        ];
      default:
        return [];
    }
  };

  const handleSidebarClick = (item) => {
    if (user.role === 'user') {
      if (item.path) {
        navigate(item.path);
      }
    } else {
      setActiveTab(item.action);
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">{dashboardTitle}</h1>
      </div>
      <ul className="sidebar-menu">
        {getMenuItems().map((item, index) => (
          <li key={item.action}>
            <button
              className={`sidebar-menu-item ${activeTab === item.action ? 'active' : ''}`}
              onClick={() => handleSidebarClick(item)}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;