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
  const [openDropdownId, setOpenDropdownId] = useState(null);

const [showDeleteModal, setShowDeleteModal] = useState(false);
const [deleteUserId, setDeleteUserId] = useState(null);


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

  const openDeleteModal = (id) => {
  setDeleteUserId(id);
  setShowDeleteModal(true);
  setOpenDropdownId(null); // <-- เพิ่มบรรทัดนี้

};

const closeDeleteModal = () => {
  setShowDeleteModal(false);
  setDeleteUserId(null);
};

const confirmDelete = async () => {
  try {
    await axios.delete(`/api/users/${deleteUserId}`);
    fetchUsers(localStorage.getItem('authToken'));
    closeDeleteModal();
  } catch (err) {
    alert('Failed to delete user');
    closeDeleteModal();
  }
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
      setOpenDropdownId(null);
    } catch (err) {
      alert('Failed to change role');
    }
  };

  const handleResetPassword = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/users/${id}/reset-password`);
      alert('Password reset successfully');
      setOpenDropdownId(null);
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

  // ปิด dropdown เมื่อคลิกข้างนอก
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown')) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    <>
    {showDeleteModal && (
  <div className="user-management-modal-overlay">
    <div className="user-management-modal-content">
      <button className="user-management-modal-close" onClick={closeDeleteModal}>
        &#10006;
      </button>
      <div className="user-management-modal-icon">
        <FaTrash size={48} color="#f44336" />
      </div>
      <h2>Delete User</h2>
      <p>Are you sure you want to delete this user?</p>
      <div className="user-management-modal-actions">
        <button className="btn btn-danger" onClick={confirmDelete}>Delete</button>
        <button className="btn" onClick={closeDeleteModal}>Cancel</button>
      </div>
    </div>
  </div>
)}
    
    <NavAdmin>
      <div className="user-management-container">
        <div className="user-management-content">
          <h1 className="user-management-title">Admin Management</h1>
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
                          getStatus(user.lastLogin) === 'Active'
                            ? 'status-active'
                            : 'status-inactive'
                        }`}
                      >
                        {getStatus(user.lastLogin)}
                      </span>
                    </td>
                    <td className="action-buttons column-buttons">
                      <div className="dropdown" style={{ position: 'relative' }}>
                        <button
                          className="btn btn-primary dropdown-toggle"
                          onClick={() =>
                            setOpenDropdownId(
                              openDropdownId === user._id ? null : user._id
                            )
                          }
                          type="button"
                        >
                          Actions
                        </button>
                        <div
                          className="dropdown-menu"
                          style={{
                            display: openDropdownId === user._id ? 'block' : 'none',
                            position: 'absolute',
                            left: 0,
                            top: '100%',
                            zIndex: 100,
                          }}
                        >
                          <button
                            onClick={() =>
                              handleRoleChange(
                                user._id,
                                user.role === 'admin' ? 'user' : 'admin'
                              )
                            }
                            className="dropdown-item"
                          >
                            {user.role === 'admin' ? <FaUser /> : <FaUserShield />}
                            {user.role === 'admin' ? ' Make User' : ' Make Admin'}
                          </button>
                          <button
                            onClick={() => handleResetPassword(user._id)}
                            className="dropdown-item"
                          >
                            <FaRedo /> Reset Password
                          </button>
                          <button
                            onClick={() => openDeleteModal(user._id)}
                            className="dropdown-item"
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </NavAdmin>
    </>
  );
}

export default UserManagement;