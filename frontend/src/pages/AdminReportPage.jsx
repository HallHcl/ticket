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

const statusOptions = [
  { value: 'ALL', label: 'All' },
  { value: 'WAIT FOR ASSET', label: 'WAIT FOR ASSET' },
  { value: 'WORK IN PROGRESS', label: 'WORK IN PROGRESS' },
  { value: 'CHECKING', label: 'CHECKING' },
  { value: 'PENDING', label: 'PENDING' },
  { value: 'COMPLETED', label: 'COMPLETED' },
  { value: 'CANCELLED', label: 'CANCELLED' }
];

const AdminReportPage = () => {
  const [report, setReport] = useState(null);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const formatStatus = (status) => status.trim().toUpperCase();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.role === 'admin') {
          setIsAuthorized(true);
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
          const res = await axios.get('http://localhost:5000/api/tickets/report');
          setReport(res.data);
          setFilteredTickets(res.data.tickets);
        } catch (err) {
          setError('ไม่สามารถโหลดรายงานได้');
        } finally {
          setLoading(false);
        }
      };

      fetchReport();
    }
  }, [isAuthorized]);

  const filterTicketsByDate = () => {
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    let filtered = report.tickets.filter(ticket => {
      const createdAt = new Date(ticket.createdAt);
      // ไม่ต้อง setHours กับ createdAt
      return createdAt >= start && createdAt <= end;
    });

    // Apply status filter after date filter
    if (selectedStatus !== 'ALL') {
      filtered = filtered.filter(ticket => ticket.status === selectedStatus);
    }

    setFilteredTickets(filtered);
  } else {
    // If no date filter, just filter by status
    let filtered = report.tickets;
    if (selectedStatus !== 'ALL') {
      filtered = filtered.filter(ticket => ticket.status === selectedStatus);
    }
    setFilteredTickets(filtered);
  }
};

  // Whenever status changes, re-filter
  useEffect(() => {
    if (report) {
      filterTicketsByDate();
    }
    // eslint-disable-next-line
  }, [selectedStatus]);

  const getChartData = () => {
    if (!filteredTickets || filteredTickets.length === 0) return [];

    const sortedStatuses = [
      'WAIT FOR ASSET',
      'WORK IN PROGRESS',
      'CHECKING',
      'PENDING',
      'COMPLETED',
      'CANCELLED'
    ];

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
  if (selectedStatus === 'ALL') {
    // 1. สรุปจำนวนแต่ละสถานะ
    const sortedStatuses = [
      'WAIT FOR ASSET',
      'WORK IN PROGRESS',
      'CHECKING',
      'PENDING',
      'COMPLETED',
      'CANCELLED'
    ];
    const summary = sortedStatuses.map(status => {
      const count = filteredTickets.filter(ticket => ticket.status === status).length;
      return {
        'Status': status,
        'Ticket Count': count
      };
    });

    // เพิ่มแถว Total Ticket
    const totalTicket = summary.reduce((sum, row) => sum + row['Ticket Count'], 0);
    summary.push({ 'Status': 'Total Ticket', 'Ticket Count': totalTicket });

    // 2. รายละเอียด ticket
    const detailHeader = [
      { 'Branch Code': 'Branch Code', 'Status': 'Status', 'Created At': 'Created At', 'Details': 'Details' }
    ];
    const detailRows = filteredTickets.map(ticket => ({
      'Branch Code': ticket.branchCode,
      'Status': ticket.status,
      'Created At': new Date(ticket.createdAt).toLocaleString(),
      'Details': ticket.details || ''
    }));

    // รวม summary + เว้น 1 แถว + header + รายละเอียด
    const csvSummary = Papa.unparse(summary);
    const csvDetails = Papa.unparse([...detailHeader, ...detailRows], { header: false });
    const csv = `${csvSummary}\n\n${csvDetails}`;

    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'tickets_summary_and_detail.csv');
      link.click();
    }
    return;
  }



  // ถ้าเลือกสถานะเฉพาะ
  let ticketsToExport = filteredTickets.filter(ticket => ticket.status === selectedStatus);
  const csvData = ticketsToExport.map(ticket => ({
    'Branch Code': ticket.branchCode,
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
        placeholder="dd/mm/yyyy"
      />
    </label>
    <label>
      End Date:
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        placeholder="dd/mm/yyyy"
      />
    </label>
  </div>
  <div className="status-dropdown">
    <label>
      Status:
      <select
        value={selectedStatus}
        onChange={e => setSelectedStatus(e.target.value)}
        style={{ marginLeft: '8px' }}
      >
        {statusOptions.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
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

        {filteredTickets && (
  <div className="dashboard-stats grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
    <div className="stat-card bg-white shadow-md rounded-xl p-4 flex flex-col justify-center items-center h-36">
      <h3 className="text-sm font-semibold text-gray-500">Total Tickets</h3>
      <p className="text-2xl font-bold text-gray-800">{filteredTickets.length}</p>
    </div>
    {[
      'WAIT FOR ASSET',
      'WORK IN PROGRESS',
      'CHECKING',
      'PENDING',
      'COMPLETED',
      'CANCELLED'
    ].map(status => {
      const count = filteredTickets.filter(ticket => formatStatus(ticket.status) === formatStatus(status)).length;
      return (
        <div
          className="stat-card bg-white shadow-md rounded-xl p-4 flex flex-col justify-center items-center h-36"
          key={status}
        >
          <h3 className="text-sm font-semibold text-gray-500 text-center">{formatStatus(status)}</h3>
          <p className="text-2xl font-bold text-gray-800">{count}</p>
        </div>
      );
    })}
  </div>
)}

        {report && (
          <div className="tickets-section bg-white shadow-md rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Ticket Status Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value">
                {getChartData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={statusColors[entry.name]} />
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