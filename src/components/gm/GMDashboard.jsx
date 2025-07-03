import React from 'react';
import { useState, useContext } from 'react';
import { LetterContext } from '../../context/LetterContext';
import Header from '../common/Header';
import Sidebar from '../common/Sidebar';
import GMInbox from './GMInbox';
import GMClosed from './GMClosed';
import Reports from './Reports';
import ChangePassword from '../auth/ChangePassword';

const GMDashboard = () => {
  const [activeTab, setActiveTab] = useState('inbox');
  const { letters, loading, modifyLetter } = useContext(LetterContext);

  const renderTab = () => {
    switch (activeTab) {
      case 'inbox':
        return <GMInbox />;
      case 'closed':
        return <GMClosed />;
      case 'reports':
        return <Reports />;
      case 'change-password':
        return <ChangePassword />;
      default:
        return <GMInbox />;
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

export default GMDashboard;