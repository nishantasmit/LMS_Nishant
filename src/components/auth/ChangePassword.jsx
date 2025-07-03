import React from 'react';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { changePassword } from '../../services/authService';
import './ChangePassword.css';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      await changePassword({
        username: user.username,
        newPassword: formData.newPassword
      });
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError('Failed to change password. Please try again.');
    }
  };

  return (
    <div className="change-password-card">
      <h2>Change Password</h2>
      {error && <p className="change-password-error">{error}</p>}
      {success && <p className="change-password-success">Password changed successfully!</p>}
      <form onSubmit={handleSubmit} className="change-password-form">
        <div className="form-group">
          <label>Current Password:</label>
          <input
            type="password"
            value={formData.currentPassword}
            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>New Password:</label>
          <input
            type="password"
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Confirm New Password:</label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
          />
        </div>
        <button type="submit" className="change-password-btn">Change Password</button>
      </form>
    </div>
  );
};

export default ChangePassword;