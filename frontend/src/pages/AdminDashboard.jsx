import { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import NavAdmin from '../components/NavbarAdmin';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [, setDecodedToken] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(''); // State for selected status
  const [selectedIssueType, setSelectedIssueType] = useState(''); // State for selected issue type
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setDecodedToken(decoded);
        localStorage.setItem('decodedToken', JSON.stringify(decoded));

        if (decoded.role === 'admin') {
          setIsAuthorized(true);
          fetchTickets();
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

  const fetchTickets = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tickets');
      setTickets(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching tickets');
      setLoading(false);
    }
  };

  // Filter tickets based on the selected status and issue type
  const filteredTickets = tickets
  .filter(ticket => {
    const matchesStatus = selectedStatus ? ticket.status === selectedStatus : true;
    const matchesIssueType = selectedIssueType ? ticket.issueType === selectedIssueType : true;
    const matchesSearch =
      ticket.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.branchCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.issueType.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesIssueType && matchesSearch;
  })
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // เรียงล่าสุดอยู่บนสุด

  


  const ticketStats = {
    total: tickets.length,
    pending: tickets.filter(ticket => ticket.status === 'PENDING').length,
    inProgress: tickets.filter(ticket => ticket.status === 'WORK IN PROGRESS').length,
    checking: tickets.filter(ticket => ticket.status === 'CHECKING').length,
    cancelled: tickets.filter(ticket => ticket.status === 'CANCELLED').length,
    completed: tickets.filter(ticket => ticket.status === 'COMPLETED').length,
  };

  const updateTicketStatus = async (ticketId, newStatus) => {
    const token = localStorage.getItem('authToken');
    try {
      await axios.put(
        `http://localhost:5000/api/tickets/${ticketId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchTickets(); // Re-fetch tickets after updating status
    } catch (err) {
      setError('Error updating ticket status');
    }
  };

  // Handle filter status click
  const handleFilterClick = (status) => {
    setSelectedStatus(status);
  };

  // Handle issue type filter click
const handleIssueTypeFilter = (issueType) => {
  setSelectedIssueType(issueType);
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

  // ด้านบนของไฟล์ component
  const getHeaderColorClass = (ticket) => {
    if (ticket.status === 'COMPLETED') return 'header-completed';
  
    const createdDate = new Date(ticket.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
    if (diffDays <= 3) return 'header-normal';
    if (diffDays <= 6) return 'header-warning';
    return 'header-danger';
  };
  
  return (
    <NavAdmin>
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="header-actions">
          <button className="refresh-btn" onClick={fetchTickets}>Refresh</button>
        </div>
      </header>

      <div className="dashboard-stats">
        <div className="stat-card" onClick={() => handleFilterClick('')}>
          <h3>Total</h3>
          <p className="stat-number">{ticketStats.total}</p>
        </div>
        <div className="stat-card" onClick={() => handleFilterClick('PENDING')}>
          <h3>Pending</h3>
          <p className="stat-number">{ticketStats.pending}</p>
        </div>
        <div className="stat-card" onClick={() => handleFilterClick('WORK IN PROGRESS')}>
          <h3>Progress</h3>
          <p className="stat-number">{ticketStats.inProgress}</p>
        </div>
        <div className="stat-card" onClick={() => handleFilterClick('CHECKING')}>
          <h3>CHECKING</h3>
          <p className="stat-number">{ticketStats.checking}</p>
        </div>
        <div className="stat-card" onClick={() => handleFilterClick('CANCELLED')}>
          <h3>CANCELLED</h3>
          <p className="stat-number">{ticketStats.cancelled}</p>
        </div>
        <div className="stat-card" onClick={() => handleFilterClick('COMPLETED')}>
          <h3>COMPLETED</h3>
          <p className="stat-number">{ticketStats.completed}</p>
        </div>
      </div>

      <div className="issue-type-filters">
        <button onClick={() => handleIssueTypeFilter('')}>ทั้งหมด</button>
        <button onClick={() => handleIssueTypeFilter('แจ้งปัญหาการใช้งานทั่วไป')}>แจ้งปัญหาการใช้งานทั่วไป</button>
        <button onClick={() => handleIssueTypeFilter('เบิก/เปลี่ยนอุปกรณ์')}>เบิก/เปลี่ยนอุปกรณ์</button>
      </div>

      <section className="tickets-section">

      <div className="header-search">
        <h2>Tickets List</h2>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search Ticket"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

        {filteredTickets.length > 0 ? (
          <div className="tickets-grid">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket._id}
                onClick={() => navigate(`/ticket/${ticket._id}`)}
                className="ticket-card"
                style={{ cursor: 'pointer' }}
              >
                <div className={`ticket-header ${getHeaderColorClass(ticket)}`}>
                  <span className={`issue-type ${getHeaderColorClass(ticket)}`}>
                    {ticket.issueType}
                  </span>
                  <span className="ticket-date">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="ticket-content">
                  <div className="ticket-info">
                    <span className="info-label">Branch Code:</span>
                    <span className="info-value">{ticket.branchCode}</span>
                  </div>
                  <div className="ticket-info">
                    <span className="info-label">AnyDesk:</span>
                    <span className="info-value">{ticket.anydeskNumber || 'Not provided'}</span>
                  </div>
                  <div className="ticket-details">
                    <span className="info-label">Details:</span>
                    <p>{ticket.details}</p>
                  </div>
                </div>
                <div className="ticket-footer">
            <select
  value={ticket.status || 'WAIT FOR ASSET'}
  onChange={(e) => {
    e.stopPropagation();
    updateTicketStatus(ticket._id, e.target.value);
  }}
  onClick={(e) => e.stopPropagation()} // เพิ่มบรรทัดนี้
>
  <option value="WAIT FOR ASSET">WAIT FOR ASSET</option>
  <option value="WORK IN PROGRESS">WORK IN PROGRESS</option>
  <option value="PENDING">PENDING</option>
  <option value="CHECKING">CHECKING</option>
  <option value="CANCELLED">CANCELLED</option>
  <option value="COMPLETED">COMPLETED</option>
</select>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No tickets available at this time.</p>
          </div>
        )}
      </section>
    </div>
    </NavAdmin>
  );
};

export default AdminDashboard;