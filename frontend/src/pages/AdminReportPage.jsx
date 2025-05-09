import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from 'recharts';
import './AdminReportPage.css';
import Papa from 'papaparse';
import NavAdmin from '../components/NavbarAdmin';

const statusColors = {
  'WAIT FOR ASSET': '#3498db',
  'WORK IN PROGRESS': '#ffeb3b',
  'CHECKING': '#FF6600',
  'PENDING': '#4527a0',
  'COMPLETED': '#2ecc71',
  'CANCELLED': '#ff0000'
};

const AdminReportPage = () => {
  const [report, setReport] = useState(null);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false); // เพิ่ม state สำหรับตรวจสอบสิทธิ์

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.role === 'admin') {
          setIsAuthorized(true);  // ถ้าเป็นแอดมิน ให้ตั้งค่าเป็น true
        } else {
          setError('Access denied: Admin privileges required');
          setLoading(false);
        }
      } catch (err) {
        setError('Invalid token');
        setLoading(false);
      }
    } else {
      setError('Authentication required');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      const fetchReport = async () => {
        try {
          console.log('Fetching report data...');
          const res = await axios.get('http://localhost:5000/api/tickets/report');
          console.log('Report data:', res.data);
          setReport(res.data);
          setFilteredTickets(res.data.tickets);  // Initially show all tickets
        } catch (err) {
          console.error('Error fetching report:', err);
          setError('ไม่สามารถโหลดรายงานได้');
        } finally {
          setLoading(false);
        }
      };

      fetchReport();
    }
  }, [isAuthorized]);

  const filterTicketsByDate = () => {
    console.log('Applying filter with startDate:', startDate, 'and endDate:', endDate);
  
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999); // Set end date to 23:59:59.999
  
      const filtered = report.tickets.filter(ticket => {
        const createdAt = new Date(ticket.createdAt);
        createdAt.setHours(0, 0, 0, 0);
        return createdAt >= start && createdAt <= end;
      });
  
      setFilteredTickets(filtered);
    }
  };

  const getChartData = () => {
    if (!filteredTickets || filteredTickets.length === 0) return [];

    const sortedStatuses = ['WAIT FOR ASSET', 'WORK IN PROGRESS', 'CHECKING', 'PENDING', 'COMPLETED', 'CANCELLED'];

    const statusCount = sortedStatuses.reduce((acc, status) => {
      acc[status] = filteredTickets.filter(ticket => ticket.status === status).length;
      return acc;
    }, {});

    return sortedStatuses.map(status => ({
      name: status,
      value: statusCount[status] || 0
    }));
  };

  const exportToCSV = () => {
    const csvData = filteredTickets.map(ticket => ({
      'Ticket ID': ticket._id,
      'Status': ticket.status,
      'Created At': new Date(ticket.createdAt).toLocaleString(),
      'Details': ticket.details || ''
    }));
  
    const csv = Papa.unparse(csvData);
  
    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
  
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'tickets_report.csv');
      link.click();
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>Reloading...
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
      <div className="admin-dashboard p-6">
        <div className="dashboard-header flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Report all repair reports</h1>
          <button
            className="refresh-btn border-blue-500 text-blue-500 px-4 py-1 rounded hover:bg-blue-50 transition"
            onClick={() => window.location.reload()}
          >
            Refresh
          </button>
        </div>

        <div className="filter-section">
          <div className="date-inputs">
            <label>
              Start Date:
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </label>
            <label>
              End Date:
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </label>
          </div>
          <div className="button-group">
            <button
              className="apply-filter-btn"
              onClick={filterTicketsByDate}
            >
              Apply
            </button>
            <button
              className="export-btn"
              onClick={exportToCSV}
            >
              Export CSV
            </button>
          </div>
        </div>

        {report && (
          <div className="dashboard-stats grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
            <div className="stat-card bg-white shadow-md rounded-xl p-4 flex flex-col justify-center items-center h-36">
              <h3 className="text-sm font-semibold text-gray-500">Total Tickets</h3>
              <p className="text-2xl font-bold text-gray-800">{report.totalTickets}</p>
            </div>
            {Object.entries(report.statusSummary).map(([status, count]) => (
              <div
                className="stat-card bg-white shadow-md rounded-xl p-4 flex flex-col justify-center items-center h-36"
                key={status}
              >
                <h3 className="text-sm font-semibold text-gray-500 text-center">{status}</h3>
                <p className="text-2xl font-bold text-gray-800">{count}</p>
              </div>
            ))}
          </div>
        )}

        {report && (
          <div className="tickets-section bg-white shadow-md rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Ticket Status Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value">
                  {getChartData().map((entry) => (
                    <Cell key={entry.name} fill={statusColors[entry.name]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </NavAdmin>
  );
};

export default AdminReportPage;
