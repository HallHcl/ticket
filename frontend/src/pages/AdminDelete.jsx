import { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDelete = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTickets();
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

  const deleteTicket = async (ticketId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tickets/${ticketId}`);
      fetchTickets(); // Refresh list
    } catch (err) {
      setError('Error deleting ticket');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Ticket Manager</h1>
      {tickets.length === 0 ? (
        <p>No tickets found.</p>
      ) : (
        <ul className="ticket-list">
          {tickets.map((ticket) => (
            <li key={ticket._id} className="ticket-item">
              <div>
                <strong>{ticket.issueType}</strong> — {ticket.branchCode}<br />
                <small>{new Date(ticket.createdAt).toLocaleString()}</small>
              </div>
              <button onClick={() => deleteTicket(ticket._id)} className="delete-btn">
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminDelete;
