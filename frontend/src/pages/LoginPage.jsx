import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Handle login form submission
  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });

    localStorage.setItem('authToken', response.data.token);

    // Check user role and navigate accordingly
    const userRole = response.data.user?.role;
    if (userRole === 'admin') {
      navigate('/admin-dashboard');
    } else {
      navigate('/');
    }
  } catch (error) {
    setErrorMessage('Invalid credentials, please try again.');
  }
};


  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Please enter your credentials to login</p>
        </div>
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <div className="input-icon">
              <FaUser className="icon" />
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Username"
              />
            </div>
          </div>
          
          <div className="form-group">
            <div className="input-icon">
              <FaLock className="icon" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
              />
            </div>
          </div>
          
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          
          <button type="submit" className="login-btn">
            <FaSignInAlt className="btn-icon" /> Login
          </button>
        </form>
        
        <div className="login-footer">
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <p>IT Support System</p>
      </Link>
    </div>
      </div>
      
      <style jsx>{`
        .login-page {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .login-container {
          width: 400px;
          background-color: rgba(255, 255, 255, 0.95);
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          animation: fadeIn 0.5s ease;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .login-header {
          text-align: center;
          margin-bottom: 25px;
        }
        
        .login-header h2 {
          color: #4a5568;
          margin-bottom: 8px;
          font-size: 26px;
        }
        
        .login-header p {
          color: #718096;
          font-size: 14px;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        .input-icon {
          position: relative;
          display: flex;
          align-items: center;
        }
        
        .icon {
          position: absolute;
          left: 12px;
          color: #a0aec0;
          font-size: 16px;
        }
        
        input {
          width: 100%;
          padding: 12px 12px 12px 40px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 15px;
          transition: all 0.3s;
          outline: none;
        }
        
        input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.25);
        }
        
        .error-message {
          color: #e53e3e;
          font-size: 14px;
          margin-bottom: 15px;
          text-align: center;
        }
        
        .login-btn {
          width: 100%;
          padding: 12px;
          background: linear-gradient(to right, #667eea, #764ba2);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: all 0.3s;
        }
        
        .login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .btn-icon {
          margin-right: 8px;
        }
        
        .login-footer {
          text-align: center;
          margin-top: 25px;
          color: #718096;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
