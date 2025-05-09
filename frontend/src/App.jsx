import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Preloader from "./components/Preloader";
import Home from './pages/Home';
import ITStaffList from './pages/ITStaffList';
import Manuals from './pages/Manuals';
import News from './pages/News';
import Videos from './pages/Videos';
import NotebookEbook from './pages/NotebookEbook';
import PrinterEbook from './pages/PrinterEbook';
import WifiEbook from './pages/WifiEbook';
import NotebookVideo from './pages/NotebookVideo';
import PrinterVideo from './pages/PrinterVideo';
import WifiVideo from './pages/WifiVideo';
import JoinDomain from './pages/JoinDomain';
import Language from './pages/Language';
import Time from './pages/Time';
import Initial from './pages/Initial';
import Policy from './pages/Policy';
import Security from './pages/Security';
import Maintenance from './pages/Maintenance';
import Storage from './pages/Storage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PrinterPage from './pages/PrinterPage';
import EpsonEbook from './pages/EpsonEbook';
import BrotherEbook from './pages/BrotherEbook';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import AdminReportPage from './pages/AdminReportPage';
import AdminDelete from './pages/AdminDelete';
import AdminManeger from './pages/AdminManeger'
import UserManagement from './pages/UserManagement';
import TicketDetail from './pages/TicketDetail';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [loading, setLoading] = useState(true);
  const user = { role: 'admin' }; // จำลอง role admin

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100); // แสดง Preloader 2 วินาที

    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      {loading ? (
        <Preloader />
      ) : (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/it-staff" element={<ITStaffList />} />
          <Route path="/news" element={<News />} />
          <Route path="/manuals" element={<Manuals />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/Domain" element={<JoinDomain />} />
          <Route path="/Language" element={<Language />} />
          <Route path="/Time" element={<Time />} />
          <Route path="/Initial" element={<Initial />} />
          <Route path="/Policy" element={<Policy />} />
          <Route path="/Security" element={<Security />} />
          <Route path="/Maintenance" element={<Maintenance />} />
          <Route path="/Storage" element={<Storage />} />
          <Route path="/notebook-ebook" element={<NotebookEbook />} />
          <Route path="/printer-ebook" element={<PrinterEbook />} />
          <Route path="/wifi-ebook" element={<WifiEbook />} />
          <Route path="/notebook-video" element={<NotebookVideo />} />
          <Route path="/printer-video" element={<PrinterVideo />} />
          <Route path="/wifi-video" element={<WifiVideo />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/admin-report" element={<AdminReportPage />} />
          <Route path="/admin-delete" element={<AdminDelete />} /> 
          <Route path="/admin-maneger" element={<AdminManeger />} />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute userRole={user.role}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-management"
            element={
              <ProtectedRoute userRole={user.role}>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route path="/printer" element={<PrinterPage />} />
          <Route path="/epson-ebook" element={<EpsonEbook />} />
          <Route path="/brother-ebook" element={<BrotherEbook />} />
          <Route path="/ticket/:id" element={<TicketDetail />} />

        </Routes>
      )}
    </Router>
  );
};

export default App;
