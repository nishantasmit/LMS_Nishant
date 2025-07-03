import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LetterContext } from '../../context/LetterContext';
import { AuthContext } from '../../context/AuthContext';
import { formatDate } from '../../utils/helpers';
import './UserDashboard.css';

const UserDashboard = () => {
  const { letters, loading, error } = useContext(LetterContext);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  // Tabs: 'live' (SSM letters), 'gm' (GM-verified letters)
  const [activeTab, setActiveTab] = useState('live');

  // Live SSM letters assigned to this user by GM
  const liveLetters = letters.filter(
    letter =>
      letter.senderRole === 'ssm' &&
      letter.status !== 'closed' &&
      Array.isArray(letter.visibleTo) &&
      letter.visibleTo.includes(username)
  );
  // GM-verified letters: sent by this user to GM and approved, OR marked for this user and approved
  const gmVerifiedLetters = letters.filter(
    letter =>
      letter.status === 'approved' &&
      (
        (letter.sender === username && letter.receiverRole === 'gm') ||
        (Array.isArray(letter.visibleTo) && letter.visibleTo.includes(username))
      )
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="user-dashboard">
        <div className="user-dashboard-container">
          <div className="user-dashboard-loading">Loading letters...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-dashboard">
        <div className="user-dashboard-container">
          <div className="user-dashboard-error">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      <div className="user-dashboard-container">
        <div className="user-dashboard-header">
          <h1 className="user-dashboard-title">
            <img src="/indianrailways-whitebg.png" alt="Indian Railways" style={{ height: '1.5em', verticalAlign: 'middle', marginRight: '0.5em' }} />
            Letter Monitoring System
          </h1>
          <button
            className="user-dashboard-logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        <div className="user-dashboard-content">
          {/* Welcome Section */}
          <div className="user-welcome user-dashboard-section">
            <h2 className="user-welcome-title gradient-text">Welcome, Mr. {username}</h2>
            <div className="user-dashboard-stats">
              <div className="user-dashboard-stat-card">
                <div className="user-dashboard-stat-number">{liveLetters.length}</div>
                <div className="user-dashboard-stat-label">Live Letters</div>
              </div>
              <div className="user-dashboard-stat-card">
                <div className="user-dashboard-stat-number">{gmVerifiedLetters.length}</div>
                <div className="user-dashboard-stat-label">Verified by GM</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="user-dashboard-tabs">
            <button
              className={`user-dashboard-tab ${activeTab === 'live' ? 'active' : ''}`}
              onClick={() => setActiveTab('live')}
            >
              📥 Live Letters
            </button>
            <button
              className={`user-dashboard-tab ${activeTab === 'gm' ? 'active' : ''}`}
              onClick={() => setActiveTab('gm')}
            >
              ✅ Verified by GM
            </button>
          </div>

          {/* Tab Content */}
          <div className="user-dashboard-tab-content">
            {activeTab === 'live' && (
              <div className="user-inbox user-dashboard-section">
                <h2 className="user-inbox-title">📥 Inbox</h2>
                <p className="user-inbox-subtitle">Live letters from SSM</p>
                {liveLetters.length === 0 ? (
                  <div className="user-inbox-empty">
                    <p>No live letters available.</p>
                  </div>
                ) : (
                  <div className="user-inbox-list">
                    {liveLetters.map(letter => (
                      <div key={letter.id || letter._id} className="user-letter-card">
                        <div className="user-letter-header">
                          <h3 className="user-letter-subject">{letter.subject}</h3>
                          <span className={`user-letter-status ${letter.status}`}>
                            {letter.status === 'pending' ? 'Pending Review' : letter.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="user-letter-details">
                          <p><strong>From:</strong> {letter.sender}</p>
                          <p><strong>Date:</strong> {letter.receivingDate || formatDate(letter.createdAt)}</p>
                          <p><strong>Office DAK Receipt No:</strong> {letter.officeDakReceiptNo}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {activeTab === 'gm' && (
              <div className="user-gm-verified user-dashboard-section">
                <h2 className="user-inbox-title">✅ Verified by GM</h2>
                <p className="user-inbox-subtitle">Your letters approved by GM</p>
                {gmVerifiedLetters.length === 0 ? (
                  <div className="user-inbox-empty">
                    <p>No letters verified by GM yet.</p>
                  </div>
                ) : (
                  <div className="user-inbox-list">
                    {gmVerifiedLetters.map(letter => (
                      <div key={letter.id || letter._id} className="user-letter-card verified">
                        <div className="user-letter-header">
                          <h3 className="user-letter-subject">{letter.subject}</h3>
                          <span className={`user-letter-status ${letter.status}`}>Verified</span>
                        </div>
                        <div className="user-letter-details">
                          <p><strong>To:</strong> GM</p>
                          <p><strong>Date:</strong> {letter.receivingDate || formatDate(letter.createdAt)}</p>
                          <p><strong>Office DAK Receipt No:</strong> {letter.officeDakReceiptNo}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;