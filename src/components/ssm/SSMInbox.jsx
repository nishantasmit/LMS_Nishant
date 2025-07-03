import React, { useContext } from 'react';
import { LetterContext } from '../../context/LetterContext';
import { AuthContext } from '../../context/AuthContext';
import { formatDate } from '../../utils/helpers';
import '../gm/VerifyLetters.css';

const SSMInbox = () => {
  const { letters, loading } = useContext(LetterContext);
  const { user } = useContext(AuthContext);
  const username = user?.username || localStorage.getItem('username');

  // Filter letters: only show letters sent by this SSM to GM
  const ssmLetters = letters.filter(letter => 
    letter.sender === username && letter.receiverRole === 'gm'
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
          <h1 className="verify-letters-title">
            <img src="/indianrailways-whitebg.png" alt="Indian Railways" style={{ height: '1.5em', verticalAlign: 'middle', marginRight: '0.5em' }} />
            Inbox
          </h1>
          <p className="verify-letters-subtitle">Letters sent to GM</p>
        </div>

        <div className="verify-letters-content">
          {ssmLetters.length === 0 ? (
            <div className="verify-letters-empty">
              <p>No letters found in your inbox.</p>
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
                {ssmLetters.map(letter => (
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

export default SSMInbox; 