import React from 'react';
import { useState, useContext, useEffect } from 'react';
import { LetterContext } from '../../context/LetterContext';
import { AuthContext } from '../../context/AuthContext';
import Header from '../common/Header';
import Sidebar from '../common/Sidebar';
import AddNewLetter from './AddNewLetter';
import ManageUsers from './ManageUsers';
import Reports from './Reports';
import ChangePassword from '../auth/ChangePassword';
import SSMInbox from './SSMInbox';
import SSMClosed from './SSMClosed';

const SSMDashboard = () => {
  const [activeTab, setActiveTab] = useState('inbox');
  const { letters, loading } = useContext(LetterContext);
  const { user } = useContext(AuthContext);
  const username = user?.username || localStorage.getItem('username');

  const renderTab = () => {
    switch (activeTab) {
      case 'inbox':
        return <SSMInbox />;
      case 'closed':
        return <SSMClosed />;
      case 'add-new':
        return <AddNewLetter />;
      case 'manage-users':
        return <ManageUsers />;
      case 'reports':
        return <Reports />;
      case 'change-password':
        return <ChangePassword />;
      default:
        return <SSMInbox />;
    }
  };

  return (
    <div className="dashboard">
      <Header />
      <div className="dashboard-content">
        <Sidebar setActiveTab={setActiveTab} activeTab={activeTab} />
        <main className="main-content">
          {renderTab()}
        </main>
      </div>
    </div>
  );
};

export default SSMDashboard;