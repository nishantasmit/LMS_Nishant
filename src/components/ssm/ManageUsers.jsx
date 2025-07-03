import React, { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../../services/userService';
import './ManageUsers.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newUser, setNewUser] = useState({ 
    username: '', 
    password: '', 
    role: 'user' 
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      setMessage(`Error fetching users: ${error.message}`);
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUser.username || !newUser.password) {
      setMessage('Please fill in all fields');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    try {
      console.log('Creating user with data:', { ...newUser, password: '[HIDDEN]' });
      const result = await createUser(newUser);
      console.log('User creation result:', result);
      setMessage('User created successfully!');
      setNewUser({ username: '', password: '', role: 'user' });
      setShowAddForm(false);
      fetchUsers(); // Refresh the list
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error creating user:', error);
      setMessage(`Error creating user: ${error.message}`);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        setMessage('User deleted successfully!');
        fetchUsers(); // Refresh the list
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage(`Error deleting user: ${error.message}`);
        setTimeout(() => setMessage(''), 5000);
      }
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await updateUser(userId, { status: newStatus });
      setMessage(`User status updated to ${newStatus}!`);
      fetchUsers(); // Refresh the list
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(`Error updating user: ${error.message}`);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="manage-users">
        <div className="manage-users-container">
          <div className="manage-users-loading">Loading users...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-users">
      <div className="manage-users-container">
        <div className="manage-users-header">
          <h1 className="manage-users-title">👥 Manage Users</h1>
          <p className="manage-users-subtitle">Create, edit, and manage system users</p>
        </div>

        <div className="manage-users-content">
          {message && (
            <div className={message.includes('Error') ? 'manage-users-error' : 'manage-users-success'}>
              {message}
            </div>
          )}

          <div className="manage-users-actions">
            <div className="manage-users-search">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              className="manage-users-add-btn"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              {showAddForm ? 'Cancel' : '+ Add User'}
            </button>
          </div>

          {showAddForm && (
            <div className="manage-users-modal">
              <div className="manage-users-modal-content">
                <div className="manage-users-modal-header">
                  <h2 className="manage-users-modal-title">Add New User</h2>
                  <button
                    className="manage-users-modal-close"
                    onClick={() => setShowAddForm(false)}
                  >
                    ×
                  </button>
                </div>
                <form onSubmit={handleAddUser} className="manage-users-form">
                  <div className="manage-users-form-group">
                    <label className="manage-users-form-label">Username:</label>
                    <input
                      type="text"
                      value={newUser.username}
                      onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                      required
                      placeholder="Enter username"
                      className="manage-users-form-input"
                    />
                  </div>
                  <div className="manage-users-form-group">
                    <label className="manage-users-form-label">Password:</label>
                    <input
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      required
                      placeholder="Enter password"
                      className="manage-users-form-input"
                    />
                  </div>
                  <div className="manage-users-form-group">
                    <label className="manage-users-form-label">Role:</label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                      className="manage-users-form-select"
                    >
                      <option value="user">User</option>
                      <option value="ssm">SSM</option>
                      <option value="gm">GM</option>
                    </select>
                  </div>
                  <div className="manage-users-form-actions">
                    <button type="submit" className="manage-users-form-btn save">
                      Create User
                    </button>
                    <button
                      type="button"
                      className="manage-users-form-btn cancel"
                      onClick={() => setShowAddForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <table className="manage-users-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user._id}>
                  <td>{user.username}</td>
                  <td>
                    <span className={`manage-users-role ${user.role}`}>
                      {user.role.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <span className={`manage-users-status ${user.status || 'active'}`}>
                      {user.status || 'active'}
                    </span>
                  </td>
                  <td>
                    <div className="manage-users-actions-cell">
                      <button
                        onClick={() => handleToggleUserStatus(user._id, user.status || 'active')}
                        className="manage-users-btn toggle"
                        disabled={user.role === 'gm'}
                      >
                        {user.status === 'inactive' ? 'Activate' : 'Deactivate'}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="manage-users-btn delete"
                        disabled={user.role === 'gm'}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="manage-users-empty">
              <p>No users found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;