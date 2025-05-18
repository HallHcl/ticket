import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NavAdmin.css';

const NavbarAdmin = ({ children }) => {
//   const [activeDropdown, setActiveDropdown] = useState(null);
//   const [isHovering, setIsHovering] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('Guest');
  const navRef = useRef(null);
  const navigate = useNavigate();

  // Function to decode JWT token
  const decodeJWT = (token) => {
    try {
      // JWT token consists of three parts: header.payload.signature
      // We need the payload (second part)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return null;
    }
  };

  useEffect(() => {
    // Check if user is logged in when component mounts
    const token = localStorage.getItem('authToken');
    
    if (token) {
      setIsLoggedIn(true);
      
      // Decode the token to get user information
      const decodedToken = decodeJWT(token);
      
      if (decodedToken) {
        // Store the decoded token for future use
        localStorage.setItem('decodedToken', JSON.stringify(decodedToken));
        
        // Extract username from the decoded token
        // Adjust these fields based on your actual JWT token structure
        setUsername(
          decodedToken.username || 
          decodedToken.name || 
          decodedToken.email || 
          decodedToken.sub ||
          'User'
        );
      } else {
        // Fallback to stored decoded token if direct decoding fails
        const storedDecodedToken = localStorage.getItem('decodedToken');
        if (storedDecodedToken) {
          try {
            const parsedUserData = JSON.parse(storedDecodedToken);
            setUsername(parsedUserData.username || parsedUserData.name || parsedUserData.email || 'User');
          } catch (error) {
            console.error('Failed to parse stored user data', error);
            setUsername('User');
          }
        }
      }
    }
  }, []);

//   const toggleDropdown = (type) => {
//     setActiveDropdown(activeDropdown === type ? null : type);
//   };

//   const handleMouseEnter = (type) => {
//     setIsHovering(true);
//     setActiveDropdown(type);
//   };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('decodedToken');
    setIsLoggedIn(false);
    setUsername('Guest');
    navigate('/login');
  }

//   const handleMouseLeave = () => {
//     setIsHovering(false);
//     // ใช้ setTimeout เพื่อให้มีเวลาคลิกก่อนที่ dropdown จะปิด
//     setTimeout(() => {
//       if (!isHovering) {
//         setActiveDropdown(null);
//       }
//     }, 300);
//   };

//   const handleDropdownMouseEnter = () => {
//     setIsHovering(true);
//   };

//   const handleDropdownMouseLeave = () => {
//     setIsHovering(false);
//     setActiveDropdown(null);
//   };

  return (
    <>
      <div className="page-container">
        <div id="headerMain">
          <div className="header-main-content">
            <div className="header-col-left">
              {/* <a href="tel:028578888">
                <i className="icon-sl-phone"></i>📱 02-857-8888 (สำนักงานใหญ่)
              </a> */}
            </div>
            <div className="header-col-right">
              <span className="username" style={{ marginRight: '10px' }}>Hi, {username}</span>
              {!isLoggedIn ? (
                <Link to="/login" className="login-btn">Login</Link>
              ) : (
                <button 
                  onClick={handleLogout} 
                  className="logout-btn"
                >
                  Logout
                </button>
              )}
              {/* <a href="/aboutus" target="_self">เกี่ยวกับเรา</a> */}
            </div>
          </div>
        </div>

        <div className="navbar" ref={navRef}>
          <div className="logo">
            <img src="https://www.turbo.co.th/static/images/logo/logo-desktop.png" alt="Logo" />
          </div>

          <nav className="nav-links">
            <ul>
              <li><Link to="/admin-dashboard">Dashboard</Link></li>
              <li><Link to="/admin-maneger">Staff Manager</Link></li>
              <li><Link to="/admin-report">Report Tickets</Link></li>
              <li><Link to="/admin-management">Management</Link></li>

              {/* <li 
                className="manuals"
                onMouseEnter={() => handleMouseEnter('manuals')}
                onMouseLeave={handleMouseLeave}
              >
                <button onClick={() => toggleDropdown('manuals')} className="manuals-button">
                  E-book
                </button>
                {activeDropdown === 'manuals' && (
                  <ul 
                    className="dropdown"
                    onMouseEnter={handleDropdownMouseEnter}
                    onMouseLeave={handleDropdownMouseLeave}
                  >
                    <li><Link to="/notebook-ebook">Notebook</Link></li>
                    <li><Link to="/printer">Printer</Link></li>
                    <li><Link to="/wifi-ebook">Wifi and VPN</Link></li>
                  </ul>
                )}
              </li>
              <li 
                className="videos"
                onMouseEnter={() => handleMouseEnter('videos')}
                onMouseLeave={handleMouseLeave}
              >
                <button onClick={() => toggleDropdown('videos')} className="videos-button">
                  Videos
                </button>
                {activeDropdown === 'videos' && (
                  <ul 
                    className="dropdown"
                    onMouseEnter={handleDropdownMouseEnter}
                    onMouseLeave={handleDropdownMouseLeave}
                  >
                    <li><Link to="/notebook-video">Notebook</Link></li>
                    <li><Link to="/printer-video">Printer</Link></li>
                    <li><Link to="/wifi-video">Wifi and VPN</Link></li>
                  </ul>
                )}
              </li> */}
              
            </ul>
          </nav>
        </div>
      </div>

      <div className="content-container">
        {children}
      </div>
    </>
  );
};

export default NavbarAdmin;