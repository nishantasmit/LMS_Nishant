import React, { useContext } from 'react';
import { LetterContext } from '../../context/LetterContext';
import { AuthContext } from '../../context/AuthContext';
import { formatDate } from '../../utils/helpers';
import '../gm/VerifyLetters.css';

const SSMOverview = () => {
  const { letters, loading } = useContext(LetterContext);
  const { user } = useContext(AuthContext);
  const username = user?.username || localStorage.getItem('username');

  // SSM can see letters they sent or received
  const ssmLetters = letters.filter(
    letter => letter.sender === username || letter.receiver === username
  );

  if (loading) {
    return (
      <div className="verify-letters">
        <div className="verify-letters-container">
          <div className="verify-letters-loading">Loading letters...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="verify-letters">
      <div className="verify-letters-container">
        <div className="verify-letters-header">
          <h1 className="verify-letters-title">📋 Your Letters Overview</h1>
          <p className="verify-letters-subtitle">Summary of all letters you have sent or received</p>
        </div>
        <div className="verify-letters-content">
          {(!ssmLetters || ssmLetters.length === 0) ? (
            <div className="verify-letters-empty">
              <p>No letters found.</p>
            </div>
          ) : (
            <table className="verify-letters-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {ssmLetters.map(letter => (
                  <tr key={letter.id || letter._id}>
                    <td>{letter.subject}</td>
                    <td>{letter.sender} ({letter.senderRole})</td>
                    <td>{letter.receiver} ({letter.receiverRole})</td>
                    <td>{letter.createdAt ? formatDate(letter.createdAt) : 'N/A'}</td>
                    <td>
                      <span className={`verify-letters-status ${letter.status}`}>
                        {letter.status === 'pending' ? 'Pending Review' : letter.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default SSMOverview; 