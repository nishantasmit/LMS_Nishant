import React, { useState, useContext } from 'react';
import { LetterContext } from '../../context/LetterContext';
import { AuthContext } from '../../context/AuthContext';
import './SendToGM.css';

const SendToGM = () => {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    receiver: 'GM',
    receiverRole: 'gm'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { addLetter } = useContext(LetterContext);
  const { user } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Debug: Check what user data is available
    console.log('AuthContext user:', user);
    console.log('localStorage username:', localStorage.getItem('username'));
    console.log('localStorage role:', localStorage.getItem('role'));

    try {
      // Use AuthContext user if available, otherwise fallback to localStorage
      const sender = user?.username || localStorage.getItem('username');
      const senderRole = user?.role || localStorage.getItem('role');

      if (!sender || !senderRole) {
        throw new Error('User information not available. Please log in again.');
      }

      const letterData = {
        ...formData,
        status: 'pending_review',
        sender: sender,
        senderRole: senderRole,
      };
      console.log('Sending letter with data:', letterData);
      await addLetter(letterData);
      setMessage('Letter sent to GM successfully!');
      setFormData({ subject: '', message: '', receiver: 'GM', receiverRole: 'gm' });
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error sending letter:', error);
      setMessage(`Error: ${error.message}`);
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="send-to-gm">
      <div className="send-to-gm-container">
        <div className="send-to-gm-header">
          <h1 className="send-to-gm-title">📤 Send Letter to General Manager</h1>
          <p className="send-to-gm-subtitle">Submit letters for GM review and approval</p>
        </div>

        <div className="send-to-gm-content">
          {message && (
            <div className={message.includes('Error') ? 'send-to-gm-error' : 'send-to-gm-success'}>
              {message}
            </div>
          )}

          {(!user?.username || !user?.role) && (
            <div className="send-to-gm-warning">
              ⚠️ User information not available. Please refresh the page or log in again.
            </div>
          )}

          <form onSubmit={handleSubmit} className="send-to-gm-form">
            <div className="send-to-gm-form-group">
              <label className="send-to-gm-form-label">Subject:</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                placeholder="Enter letter subject"
                className="send-to-gm-form-input"
              />
            </div>

            <div className="send-to-gm-form-group">
              <label className="send-to-gm-form-label">Message:</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                placeholder="Enter your message"
                rows="6"
                className="send-to-gm-form-textarea"
              />
            </div>

            <div className="send-to-gm-form-actions">
              <button 
                type="submit" 
                className="send-to-gm-form-btn send"
                disabled={loading || !user?.username || !user?.role}
              >
                {loading ? 'Sending...' : 'Send to GM'}
              </button>
              <button
                type="button"
                className="send-to-gm-form-btn cancel"
                onClick={() => {
                  setFormData({ subject: '', message: '', receiver: 'GM', receiverRole: 'gm' });
                  setMessage('');
                }}
                disabled={loading}
              >
                Clear Form
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SendToGM;