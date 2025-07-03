import React, { useContext } from 'react';
import { LetterContext } from '../../context/LetterContext';
import { AuthContext } from '../../context/AuthContext';
import { formatDate } from '../../utils/helpers';
import '../gm/VerifyLetters.css';

const SSMClosed = () => {
  const { letters, loading } = useContext(LetterContext);
  const { user } = useContext(AuthContext);
  const username = user?.username || localStorage.getItem('username');

  // Filter letters: only show letters sent by this SSM that are closed by GM
  const closedLetters = letters.filter(letter => 
    letter.sender === username && letter.status === 'closed'
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
          <h1 className="verify-letters-title">📁 Closed</h1>
          <p className="verify-letters-subtitle">Letters closed by GM</p>
        </div>

        <div className="verify-letters-content">
          {closedLetters.length === 0 ? (
            <div className="verify-letters-empty">
              <p>No closed letters found.</p>
            </div>
          ) : (
            <table className="verify-letters-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Receiving Date</th>
                  <th>Office DAK Receipt No</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {closedLetters.map(letter => (
                  <tr key={letter.id || letter._id}>
                    <td>
                      <div>
                        <strong>{letter.subject}</strong>
                        <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem', color: '#666' }}>
                          RB D.O/LETTER NO: {letter.rbDoLetterNo}
                        </p>
                      </div>
                    </td>
                    <td>{letter.receivingDate || formatDate(letter.createdAt)}</td>
                    <td>{letter.officeDakReceiptNo}</td>
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

export default SSMClosed; 