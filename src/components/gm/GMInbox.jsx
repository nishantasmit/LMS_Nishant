import React, { useState, useContext, useEffect } from 'react';
import { LetterContext } from '../../context/LetterContext';
import { formatDate } from '../../utils/helpers';
import './GMInbox.css';

const GMInbox = () => {
  const { letters, loading, modifyLetter, fetchLetters } = useContext(LetterContext);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [message, setMessage] = useState('');
  const [remarks, setRemarks] = useState('');
  
  // New state for marking letters for users
  const [showMarkModal, setShowMarkModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [markingLoading, setMarkingLoading] = useState(false);

  // Filter letters: only show letters from SSM that are not closed
  const inboxLetters = letters.filter(letter => 
    letter.senderRole === 'ssm' && letter.status !== 'closed'
  );

  const handleLetterSelect = (letterId) => {
    setSelectedLetters(prev => 
      prev.includes(letterId) 
        ? prev.filter(id => id !== letterId)
        : [...prev, letterId]
    );
  };

  const handleLetterClick = (letter) => {
    setSelectedLetter(letter);
    setShowSidePanel(true);
  };

  const handleMarkAsClosed = async () => {
    if (selectedLetters.length === 0) {
      setMessage('Please select letters to close.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    try {
      setMessage('');
      for (const letterId of selectedLetters) {
        await modifyLetter(letterId, { status: 'closed' });
      }
      setMessage(`${selectedLetters.length} letter(s) marked as closed successfully!`);
      setSelectedLetters([]);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error closing letters:', error);
      setMessage(`Error: ${error.message}`);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  // New function to handle marking letters for users
  const handleMarkForUsers = async () => {
    if (selectedLetters.length === 0) {
      setMessage('Please select letters to mark for users.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setMarkingLoading(true);
    try {
      // Get available users
      const response = await fetch('/api/letters/users/for-marking', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch users');
      const users = await response.json();
      setAvailableUsers(users);
      setShowMarkModal(true);
    } catch (error) {
      console.error('Error fetching users:', error);
      setMessage(`Error: ${error.message}`);
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setMarkingLoading(false);
    }
  };

  const handleConfirmMarkForUsers = async () => {
    if (selectedUsers.length === 0) {
      setMessage('Please select users to mark letters for.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setMarkingLoading(true);
    try {
      const usernames = selectedUsers.map(user => user.username);
      for (const letterId of selectedLetters) {
        await fetch(`/api/letters/${letterId}/mark-for-users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ usernames })
        });
      }
      await fetchLetters(); // Refresh the letter list
      setMessage(`${selectedLetters.length} letter(s) marked for ${selectedUsers.length} user(s) successfully!`);
      setSelectedLetters([]);
      setSelectedUsers([]);
      setShowMarkModal(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error marking letters for users:', error);
      setMessage(`Error: ${error.message}`);
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setMarkingLoading(false);
    }
  };

  const handleAddRemarks = async () => {
    if (!selectedLetter || !remarks.trim()) {
      setMessage('Please enter remarks.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    try {
      await modifyLetter(selectedLetter._id, { comments: remarks });
      setMessage('Remarks added successfully!');
      setRemarks('');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error adding remarks:', error);
      setMessage(`Error: ${error.message}`);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  // Add this useEffect to update selectedLetter when letters change
  useEffect(() => {
    if (showSidePanel && selectedLetter) {
      const updated = letters.find(l => l._id === selectedLetter._id);
      if (updated) setSelectedLetter(updated);
    }
  }, [letters, showSidePanel, selectedLetter]);

  if (loading) {
    return (
      <div className="gm-inbox">
        <div className="gm-inbox-container">
          <div className="gm-inbox-loading">Loading letters...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="gm-inbox-flex-layout">
      <div className={`gm-inbox-main${showSidePanel ? ' shrink' : ''}`}>
        <div className="gm-inbox-header">
          <h1 className="gm-inbox-title">
            <img src="/indianrailways-whitebg.png" alt="Indian Railways" style={{ height: '1.5em', verticalAlign: 'middle', marginRight: '0.5em' }} />
            Inbox
          </h1>
          <p className="gm-inbox-subtitle">Letters from SSM</p>
        </div>
        <div className="gm-inbox-content">
          {message && (
            <div className={message.includes('Error') ? 'gm-inbox-error' : 'gm-inbox-success'}>
              {message}
            </div>
          )}
          <div className="gm-inbox-actions">
            <button
              className="gm-inbox-btn close-selected"
              onClick={handleMarkAsClosed}
              disabled={selectedLetters.length === 0}
            >
              🔒 Close Selected ({selectedLetters.length})
            </button>
            <button
              className="gm-inbox-btn mark-for-users"
              onClick={handleMarkForUsers}
              disabled={selectedLetters.length === 0 || markingLoading}
            >
              👥 Mark for Users ({selectedLetters.length})
            </button>
          </div>
          {inboxLetters.length === 0 ? (
            <div className="gm-inbox-empty">
              <p>No letters in inbox.</p>
            </div>
          ) : (
            <div className="gm-inbox-table-wrapper">
              <table className="gm-inbox-table">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        checked={selectedLetters.length === inboxLetters.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedLetters(inboxLetters.map(l => l._id));
                          } else {
                            setSelectedLetters([]);
                          }
                        }}
                      />
                    </th>
                    <th>Subject</th>
                    <th>Receiving Date</th>
                    <th>Office DAK Receipt No</th>
                    <th>Marked For</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inboxLetters.map(letter => (
                    <tr 
                      key={letter._id} 
                      className={`gm-inbox-row ${selectedLetters.includes(letter._id) ? 'selected' : ''}`}
                      onClick={() => handleLetterClick(letter)}
                    >
                      <td onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedLetters.includes(letter._id)}
                          onChange={() => handleLetterSelect(letter._id)}
                        />
                      </td>
                      <td>{letter.subject}</td>
                      <td>{letter.receivingDate || formatDate(letter.createdAt)}</td>
                      <td>{letter.officeDakReceiptNo}</td>
                      <td>
                        {letter.visibleTo && letter.visibleTo.length > 0 ? (
                          <span className="marked-users">
                            {letter.visibleTo.join(', ')}
                          </span>
                        ) : (
                          <span className="not-marked">Not marked</span>
                        )}
                      </td>
                      <td>
                        {letter.status === 'approved' ? (
                          <span className="status-label approved">Approved</span>
                        ) : letter.status === 'rejected' ? (
                          <span className="status-label rejected">Rejected</span>
                        ) : (
                          <>
                            <button
                              className="gm-inbox-btn approve"
                              onClick={async (e) => {
                                e.stopPropagation();
                                await modifyLetter(letter._id, { status: 'approved' });
                                await fetchLetters();
                                setMessage('Letter approved successfully!');
                                setTimeout(() => setMessage(''), 3000);
                              }}
                            >
                              ✅ Approve
                            </button>
                            <button
                              className="gm-inbox-btn reject"
                              onClick={async (e) => {
                                e.stopPropagation();
                                await modifyLetter(letter._id, { status: 'rejected' });
                                await fetchLetters();
                                setMessage('Letter rejected.');
                                setTimeout(() => setMessage(''), 3000);
                              }}
                            >
                              ❌ Reject
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {showSidePanel && selectedLetter && (
        <div className="gm-inbox-side-panel">
          <button
            className="gm-inbox-side-panel-close"
            onClick={() => {
              setShowSidePanel(false);
              setSelectedLetter(null);
              setRemarks('');
            }}
            aria-label="Close"
          >
            ×
          </button>
          <div className="gm-inbox-side-panel-header">
            <h2>Letter Details</h2>
          </div>
          <div className="gm-inbox-side-panel-content">
            <div className="gm-inbox-letter-details">
              <div className="gm-inbox-detail-row">
                <strong>Subject:</strong>
                <span>{selectedLetter.subject}</span>
              </div>
              <div className="gm-inbox-detail-row">
                <strong>Office DAK Receipt No:</strong>
                <span>{selectedLetter.officeDakReceiptNo}</span>
              </div>
              <div className="gm-inbox-detail-row">
                <strong>RB D.O/LETTER NO:</strong>
                <span>{selectedLetter.rbDoLetterNo}</span>
              </div>
              <div className="gm-inbox-detail-row">
                <strong>Received From:</strong>
                <span>{selectedLetter.receivedFrom}</span>
              </div>
              <div className="gm-inbox-detail-row">
                <strong>Is DO Letter:</strong>
                <span>{selectedLetter.isDoLetter ? 'Yes' : 'No'}</span>
              </div>
              <div className="gm-inbox-detail-row">
                <strong>Receiving Date:</strong>
                <span>{selectedLetter.receivingDate}</span>
              </div>
              <div className="gm-inbox-detail-row">
                <strong>Letter Date:</strong>
                <span>{selectedLetter.letterDate}</span>
              </div>
              {/* PDF Attachment Row */}
              {selectedLetter.filePath && (
                <div className="gm-inbox-detail-row">
                  <strong>PDF Attachment:</strong>
                  <span>
                    <a href={`http://localhost:5000/uploads/${selectedLetter.filePath}`} target="_blank" rel="noopener noreferrer">
                      {selectedLetter.filePath}
                    </a>
                  </span>
                </div>
              )}
              <div className="gm-inbox-detail-row">
                <strong>Status:</strong>
                <span className={`status-${selectedLetter.status}`}>
                  {selectedLetter.status}
                </span>
              </div>
              {selectedLetter.visibleTo && selectedLetter.visibleTo.length > 0 && (
                <div className="gm-inbox-detail-row">
                  <strong>Marked For:</strong>
                  <span>{selectedLetter.visibleTo.join(', ')}</span>
                </div>
              )}
            </div>

            <div className="gm-inbox-remarks-section">
              <h3>Add Remarks</h3>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter your remarks..."
                className="gm-inbox-remarks-input"
              />
              <button
                className="gm-inbox-btn add-remarks"
                onClick={handleAddRemarks}
                disabled={!remarks.trim()}
              >
                Add Remarks
              </button>
            </div>

            {selectedLetter.comments && selectedLetter.comments.length > 0 && (
              <div className="gm-inbox-comments-section">
                <h3>Comments</h3>
                {selectedLetter.comments.map((comment, index) => (
                  <div key={index} className="gm-inbox-comment">
                    <div className="gm-inbox-comment-header">
                      <strong>{comment.author}</strong>
                      <span>{formatDate(comment.timestamp)}</span>
                    </div>
                    <p>{comment.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {showMarkModal && (
        <div className="gm-inbox-modal-overlay">
          <div className="gm-inbox-modal">
            <div className="gm-inbox-modal-header">
              <h2>Mark Letters for Users</h2>
              <button
                className="gm-inbox-modal-close"
                onClick={() => {
                  setShowMarkModal(false);
                  setSelectedUsers([]);
                }}
              >
                ×
              </button>
            </div>
            
            <div className="gm-inbox-modal-content">
              <p>Select users to mark {selectedLetters.length} letter(s) for:</p>
              
              <div className="gm-inbox-users-list">
                {availableUsers.map(user => (
                  <label key={user.username} className="gm-inbox-user-item">
                    <input
                      type="checkbox"
                      checked={selectedUsers.some(u => u.username === user.username)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers([...selectedUsers, user]);
                        } else {
                          setSelectedUsers(selectedUsers.filter(u => u.username !== user.username));
                        }
                      }}
                    />
                    <span>{user.username} ({user.role})</span>
                  </label>
                ))}
              </div>
              
              <div className="gm-inbox-modal-actions">
                <button
                  className="gm-inbox-btn cancel"
                  onClick={() => {
                    setShowMarkModal(false);
                    setSelectedUsers([]);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="gm-inbox-btn confirm"
                  onClick={handleConfirmMarkForUsers}
                  disabled={selectedUsers.length === 0 || markingLoading}
                >
                  {markingLoading ? 'Marking...' : `Mark for ${selectedUsers.length} User(s)`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GMInbox; 