import React, { useState, useContext } from 'react';
import { LetterContext } from '../../context/LetterContext';
import { AuthContext } from '../../context/AuthContext';
import './AddNewLetter.css';

const AddNewLetter = () => {
  const [formData, setFormData] = useState({
    officeDakReceiptNo: '',
    rbDoLetterNo: '',
    receivedFrom: '',
    isDoLetter: false,
    receivingDate: '',
    letterDate: '',
    subject: '',
    pdfFile: null
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { addLetter } = useContext(LetterContext);
  const { user } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
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
        receiver: 'GM',
        receiverRole: 'gm',
      };
      delete letterData.filePath;
      console.log('Sending letter with data:', letterData);
      await addLetter(letterData);
      setMessage('Letter submitted successfully!');
      handleClear();
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
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setFormData(prev => ({
        ...prev,
        pdfFile: file
      }));
    } else {
      alert('Please select a PDF file.');
      e.target.value = '';
    }
  };

  const handleClear = () => {
    setFormData({
      officeDakReceiptNo: '',
      rbDoLetterNo: '',
      receivedFrom: '',
      isDoLetter: false,
      receivingDate: '',
      letterDate: '',
      subject: '',
      pdfFile: null
    });
    setSelectedFile(null);
    setMessage('');
  };

  return (
    <div className="add-new-letter">
      <div className="add-new-letter-container">
        <div className="add-new-letter-header">
          <h1 className="add-new-letter-title">➕ Add New Letter</h1>
          <p className="add-new-letter-subtitle">Create and submit a new letter to GM</p>
        </div>

        <div className="add-new-letter-content">
          {message && (
            <div className={message.includes('Error') ? 'add-new-letter-error' : 'add-new-letter-success'}>
              {message}
            </div>
          )}

          {(!user?.username || !user?.role) && (
            <div className="add-new-letter-warning">
              ⚠️ User information not available. Please refresh the page or log in again.
            </div>
          )}

          <form onSubmit={handleSubmit} className="add-new-letter-form">
            <div className="add-new-letter-form-row">
              <div className="add-new-letter-form-group">
                <label className="add-new-letter-form-label">OFFICE DAK RECEIPT NO:</label>
                <input
                  type="text"
                  name="officeDakReceiptNo"
                  value={formData.officeDakReceiptNo}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter Office DAK Receipt Number"
                  className="add-new-letter-form-input"
                />
              </div>

              <div className="add-new-letter-form-group">
                <label className="add-new-letter-form-label">RB D.O/LETTER NO:</label>
                <input
                  type="text"
                  name="rbDoLetterNo"
                  value={formData.rbDoLetterNo}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter RB D.O/LETTER Number"
                  className="add-new-letter-form-input"
                />
              </div>
            </div>

            <div className="add-new-letter-form-row">
              <div className="add-new-letter-form-group">
                <label className="add-new-letter-form-label">RECEIVED FROM:</label>
                <input
                  type="text"
                  name="receivedFrom"
                  value={formData.receivedFrom}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter sender name/organization"
                  className="add-new-letter-form-input"
                />
              </div>

              <div className="add-new-letter-form-group">
                <label className="add-new-letter-form-label">IS DO LETTER:</label>
                <div className="add-new-letter-checkbox">
                  <input
                    type="checkbox"
                    name="isDoLetter"
                    checked={formData.isDoLetter}
                    onChange={handleInputChange}
                    className="add-new-letter-checkbox-input"
                  />
                  <span className="add-new-letter-checkbox-label">Yes, this is a DO Letter</span>
                </div>
              </div>
            </div>

            <div className="add-new-letter-form-row">
              <div className="add-new-letter-form-group">
                <label className="add-new-letter-form-label">RECEIVING DATE:</label>
                <input
                  type="date"
                  name="receivingDate"
                  value={formData.receivingDate}
                  onChange={handleInputChange}
                  required
                  className="add-new-letter-form-input"
                />
              </div>

              <div className="add-new-letter-form-group">
                <label className="add-new-letter-form-label">LETTER DATE:</label>
                <input
                  type="date"
                  name="letterDate"
                  value={formData.letterDate}
                  onChange={handleInputChange}
                  required
                  className="add-new-letter-form-input"
                />
              </div>
            </div>

            <div className="add-new-letter-form-group">
              <label className="add-new-letter-form-label">LETTER SUBJECT:</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                placeholder="Enter letter subject"
                className="add-new-letter-form-input"
              />
            </div>

            <div className="add-new-letter-form-group">
              <label className="add-new-letter-form-label">CHOOSE FILE (PDF):</label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="add-new-letter-form-file"
              />
              {selectedFile && (
                <p className="add-new-letter-file-info">Selected: {selectedFile.name}</p>
              )}
            </div>

            <div className="add-new-letter-form-actions">
              <button 
                type="submit" 
                className="add-new-letter-form-btn submit"
                disabled={loading || !user?.username || !user?.role}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
              <button
                type="button"
                className="add-new-letter-form-btn clear"
                onClick={handleClear}
                disabled={loading}
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddNewLetter; 