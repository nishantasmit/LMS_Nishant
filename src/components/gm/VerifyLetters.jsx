import React, { useState, useContext, useEffect } from 'react';
import { LetterContext } from '../../context/LetterContext';
import { formatDate } from '../../utils/helpers';
import './VerifyLetters.css';

const VerifyLetters = () => {
  const { letters, loading, modifyLetter, fetchLetters } = useContext(LetterContext);
  const [filter, setFilter] = useState('pending');
  const [message, setMessage] = useState('');
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [comments, setComments] = useState('');

  // Debug logging
  console.log('VerifyLetters: Component rendered');
  console.log('VerifyLetters: Loading state:', loading);
  console.log('VerifyLetters: Letters:', letters);
  console.log('VerifyLetters: Letters length:', letters ? letters.length : 'undefined');

  // Refresh letters when component mounts
  useEffect(() => {
    console.log('VerifyLetters: Component mounted, fetching letters...');
    fetchLetters();
  }, []); // Remove fetchLetters from dependency to prevent infinite loops

  const handleView = (letter) => {
    setSelectedLetter(letter);
    setShowViewModal(true);
  };

  const handleAction = async (letterId, action) => {
    if (action === 'approved' || action === 'rejected') {
      setSelectedLetter(letters.find(l => l._id === letterId));
      setActionType(action);
      setShowActionModal(true);
    } else {
      await performAction(letterId, action);
    }
  };

  const performAction = async (letterId, action, actionComments = '') => {
    try {
      setMessage('');
      const updateData = { status: action };
      
      if (actionComments && actionComments.trim()) {
        updateData.comments = actionComments.trim();
      }
      
      await modifyLetter(letterId, updateData);
      setMessage(`Letter ${action} successfully!`);
      setTimeout(() => setMessage(''), 3000);
      
      // Close modals
      setShowViewModal(false);
      setShowActionModal(false);
      setSelectedLetter(null);
      setComments('');
    } catch (error) {
      console.error('Error updating letter:', error);
      setMessage(`Error: ${error.message}`);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const handleActionSubmit = async () => {
    if (selectedLetter) {
      await performAction(selectedLetter._id, actionType, comments);
    }
  };

  const getFilteredLetters = () => {
    let filtered;
    switch (filter) {
      case 'pending':
        filtered = letters.filter(letter => 
          letter.status === 'pending_review' || letter.status === 'pending'
        );
        break;
      case 'approved':
        filtered = letters.filter(letter => letter.status === 'approved');
        break;
      case 'rejected':
        filtered = letters.filter(letter => letter.status === 'rejected');
        break;
      case 'closed':
        filtered = letters.filter(letter => letter.status === 'closed');
        break;
      default:
        filtered = letters;
    }
    
    return filtered;
  };

  const filteredLetters = getFilteredLetters();

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
          <h1 className="verify-letters-title">✅ Verify Letters</h1>
          <p className="verify-letters-subtitle">Review and manage letter submissions from users</p>
        </div>
        <div className="verify-letters-content">
          {message && (
            <div className={message.includes('Error') ? 'verify-letters-error' : 'verify-letters-success'}>
              {message}
            </div>
          )}

          <div className="verify-letters-filters">
            <button
              className={`verify-letters-filter ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Letters
            </button>
            <button
              className={`verify-letters-filter ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pending Review
            </button>
            <button
              className={`verify-letters-filter ${filter === 'approved' ? 'active' : ''}`}
              onClick={() => setFilter('approved')}
            >
              Approved
            </button>
            <button
              className={`verify-letters-filter ${filter === 'rejected' ? 'active' : ''}`}
              onClick={() => setFilter('rejected')}
            >
              Rejected
            </button>
            <button
              className={`verify-letters-filter ${filter === 'closed' ? 'active' : ''}`}
              onClick={() => setFilter('closed')}
            >
              Closed
            </button>
          </div>

          {filteredLetters.length === 0 ? (
            <div className="verify-letters-empty">
              <p>No letters found for the selected filter.</p>
            </div>
          ) : (
            <table className="verify-letters-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>From</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLetters.map(letter => (
                  <tr key={letter.id || letter._id}>
                    <td>
                      <div>
                        <strong>{letter.subject}</strong>
                        <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem', color: '#666' }}>
                          {letter.message && letter.message.length > 50 
                            ? `${letter.message.substring(0, 50)}...` 
                            : letter.message
                          }
                        </p>
                      </div>
                    </td>
                    <td>{letter.sender}</td>
                    <td>{letter.createdAt ? formatDate(letter.createdAt) : 'N/A'}</td>
                    <td>
                      <span className={`verify-letters-status ${letter.status}`}>
                        {letter.status === 'pending' ? 'Pending Review' : letter.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <div className="verify-letters-actions">
                        <button
                          onClick={() => handleView(letter)}
                          className="verify-letters-btn view"
                          title="View Letter Details"
                        >
                          👁️ View
                        </button>
                        {(letter.status === 'pending_review' || letter.status === 'pending') && (
                          <>
                            <button
                              onClick={() => handleAction(letter.id || letter._id, 'approved')}
                              className="verify-letters-btn approve"
                              title="Approve Letter"
                            >
                              ✅ Approve
                            </button>
                            <button
                              onClick={() => handleAction(letter.id || letter._id, 'rejected')}
                              className="verify-letters-btn reject"
                              title="Reject Letter"
                            >
                              ❌ Reject
                            </button>
                          </>
                        )}
                        {letter.status === 'approved' && (
                          <button
                            onClick={() => handleAction(letter.id || letter._id, 'closed')}
                            className="verify-letters-btn close"
                            title="Close Letter"
                          >
                            🔒 Close
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* View Letter Modal */}
      {showViewModal && selectedLetter && (
        <div className="verify-letters-modal">
          <div className="verify-letters-modal-content">
            <div className="verify-letters-modal-header">
              <h2 className="verify-letters-modal-title">📄 Letter Details</h2>
              <button
                className="verify-letters-modal-close"
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedLetter(null);
                }}
              >
                ×
              </button>
            </div>
            <div className="verify-letters-modal-body">
              <div className="letter-details">
                <div className="letter-detail-row">
                  <strong>Subject:</strong>
                  <span>{selectedLetter.subject}</span>
                </div>
                <div className="letter-detail-row">
                  <strong>From:</strong>
                  <span>{selectedLetter.sender} ({selectedLetter.senderRole})</span>
                </div>
                <div className="letter-detail-row">
                  <strong>To:</strong>
                  <span>{selectedLetter.receiver} ({selectedLetter.receiverRole})</span>
                </div>
                <div className="letter-detail-row">
                  <strong>Date:</strong>
                  <span>{formatDate(selectedLetter.createdAt)}</span>
                </div>
                <div className="letter-detail-row">
                  <strong>Status:</strong>
                  <span className={`verify-letters-status ${selectedLetter.status}`}>
                    {selectedLetter.status === 'pending' ? 'Pending Review' : selectedLetter.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="letter-detail-row">
                  <strong>Message:</strong>
                  <div className="letter-message">{selectedLetter.message}</div>
                </div>
                {selectedLetter.comments && selectedLetter.comments.length > 0 && (
                  <div className="letter-detail-row">
                    <strong>Comments:</strong>
                    <div className="letter-comments">
                      {selectedLetter.comments.map((comment, index) => (
                        <div key={index} className="comment">
                          <strong>{comment.author}</strong> - {formatDate(comment.timestamp)}
                          <p>{comment.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="verify-letters-modal-footer">
              <button
                className="verify-letters-modal-btn"
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedLetter(null);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Modal */}
      {showActionModal && selectedLetter && (
        <div className="verify-letters-modal">
          <div className="verify-letters-modal-content">
            <div className="verify-letters-modal-header">
              <h2 className="verify-letters-modal-title">
                {actionType === 'approved' ? '✅ Approve Letter' : '❌ Reject Letter'}
              </h2>
              <button
                className="verify-letters-modal-close"
                onClick={() => {
                  setShowActionModal(false);
                  setSelectedLetter(null);
                  setComments('');
                }}
              >
                ×
              </button>
            </div>
            <div className="verify-letters-modal-body">
              <div className="action-form">
                <div className="action-form-group">
                  <label className="action-form-label">Comments (Optional):</label>
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder={`Add comments for ${actionType} action...`}
                    rows="4"
                    className="action-form-textarea"
                  />
                </div>
              </div>
            </div>
            <div className="verify-letters-modal-footer">
              <button
                className="verify-letters-modal-btn cancel"
                onClick={() => {
                  setShowActionModal(false);
                  setSelectedLetter(null);
                  setComments('');
                }}
              >
                Cancel
              </button>
              <button
                className={`verify-letters-modal-btn ${actionType === 'approved' ? 'approve' : 'reject'}`}
                onClick={handleActionSubmit}
              >
                {actionType === 'approved' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyLetters;