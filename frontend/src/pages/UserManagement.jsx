import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { FaUserShield, FaUser, FaTrash, FaRedo } from 'react-icons/fa';
import axios from 'axios';
import NavAdmin from '../components/NavbarAdmin';
import './UserManagement.css';



function UserManagement() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.role === 'admin') {
          setIsAuthorized(true);
          fetchUsers(token);
        } else {
          setLoading(false);
          setError('Access denied: Admin privileges required');
        }
      } catch (err) {
        setLoading(false);
        setError('Invalid token');
      }
    } else {
      setLoading(false);
      setError('Authentication required');
    }
  }, []);

  const fetchUsers = async (token) => {
    try {
      const response = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
      setFilteredUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch users');
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
  const keyword = e.target.value;
  setSearchTerm(keyword);
  const filtered = users.filter(user =>
    user.username?.toLowerCase().includes(keyword.toLowerCase())
  );
  setFilteredUsers(filtered);
};


  const handleRoleChange = async (id, newRole) => {
    try {
      await axios.put(
        `http://localhost:5000/api/users/${id}/role`,
        { role: newRole },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        }
      );
      fetchUsers(localStorage.getItem('authToken'));
    } catch (err) {
      alert('Failed to change role');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure to delete this user?')) {
      try {
        await axios.delete(`/api/users/${id}`);
        fetchUsers(localStorage.getItem('authToken'));
      } catch (err) {
        alert('Failed to delete user');
      }
    }
  };

  const handleResetPassword = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/users/${id}/reset-password`);
      alert('Password reset successfully');
    } catch (err) {
      alert('Failed to reset password');
    }
  };

  const getStatus = (lastLogin) => {
    if (!lastLogin) return 'Inactive'; // If no lastLogin, consider user as Inactive
    const lastLoginDate = new Date(lastLogin);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - lastLoginDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 ? 'Active' : 'Inactive'; // Active if used within 7 days
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h3>Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="access-denied">
        <div className="access-denied-icon">🔒</div>
        <h2>Access Denied</h2>
        <p>You must be an admin to view this page.</p>
      </div>
    );
  }

  return (
        <NavAdmin>
    <div className="user-management-container">
      <div className="user-management-content">
        <h1 className="user-management-title">User Management</h1>
        <p className="user-count">
          Total Users: <strong>{filteredUsers.length}</strong>
        </p>
        <input
          type="text"
          placeholder="Search user..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
    <div className="table-container">
      <table className="user-table">
        <thead>
          <tr className="table-header">
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user._id} className="table-row">
              <td>{user.username}</td>
              <td className="capitalize">{user.role}</td>
              <td>
                <span
                  className={`status-badge ${
                    getStatus(user.lastLogin) === 'Active' ? 'status-active' : 'status-inactive'
                  }`}
                >
                  {getStatus(user.lastLogin)}
                </span>
              </td>
              <td className="action-buttons column-buttons">
                <button
                  onClick={() =>
                    handleRoleChange(user._id, user.role === 'admin' ? 'user' : 'admin')
                  }
                  className="btn btn-primary"
                >
                  {user.role === 'admin' ? <FaUser /> : <FaUserShield />}
                  {user.role === 'admin' ? 'Make User' : 'Make Admin'}
                </button>

                <button
                  onClick={() => handleResetPassword(user._id)}
                  className="btn btn-accent"
                >
                  <FaRedo /> Reset
                </button>

                <button
                  onClick={() => handleDelete(user._id)}
                  className="btn btn-danger"
                >
                  <FaTrash /> Delete
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>
</NavAdmin>

  );
}

export default UserManagement;
