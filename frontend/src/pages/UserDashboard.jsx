import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Layout from '../components/Layout';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import './UserDashboard.css';

const UserDashboard = () => {
  const [branchCode, setBranchCode] = useState('');
  const [anydeskNumber, setAnydeskNumber] = useState('');
  const [details, setDetails] = useState('');
  const [issueType, setIssueType] = useState('แจ้งปัญหาการใช้งานทั่วไป');
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState(null);
  const [userTickets, setUserTickets] = useState([]);
  const [attachment, setAttachment] = useState(null);
  const [branchCodes, setBranchCodes] = useState([]);
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);


  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.userId);
        fetchUserTickets(decoded.userId, token);
      } catch (err) {
        console.error('Invalid token');
        localStorage.removeItem('authToken');
        navigate('/login');
      }
    } else {
      navigate('/login');
    }

    // ดึง branch code ทั้งหมด
  axios.get('http://localhost:5000/api/branchcode/getbranchcode')
    .then(res => setBranchCodes(res.data))
    .catch(err => console.error('Error fetching branch codes:', err));
}, [navigate]);

  const fetchUserTickets = async (uid, token) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/tickets/user/${uid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserTickets(response.data);
    } catch (error) {
      console.error('Error fetching user tickets:', error);
    }
  };

  const handleFileChange = (e) => {
    setAttachment(e.target.files[0]);
  };




  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setMessage('ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่');
      return;
    }

    const formData = new FormData();
    formData.append('branchCode', branchCode);
    formData.append('anydeskNumber', anydeskNumber);
    formData.append('details', details);
    formData.append('issueType', issueType);
    formData.append('userId', userId);
    if (attachment) {
      formData.append('attachment', attachment);
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post('http://localhost:5000/api/tickets', formData, {
        headers: {
          Authorization: `Bearer token`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage(response.data.message);
      setBranchCode('');
      setAnydeskNumber('');
      setDetails('');
      setIssueType('แจ้งปัญหาการใช้งานทั่วไป');
      setAttachment(null);
      fetchUserTickets(userId, token);

      toast.success('Ticket ได้รับการส่งแล้ว!', { position: 'top-center' });
    } catch (error) {
      setMessage('เกิดข้อผิดพลาดในการส่งข้อมูล');
      console.error('Error submitting ticket:', error);
      toast.error('เกิดข้อผิดพลาดในการส่ง Ticket!', { position: 'top-center' });
    }

    setAttachment(null);  // เคลียร์ state
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // ✅ เคลียร์ input file
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'WAIT FOR ASSET':
        return '#f1c40f';
      case 'WORK IN PROGRESS':
        return '#3498db';
      case 'CHECKING':
        return '#9b59b6';
      case 'PENDING':
        return '#e67e22';
      case 'COMPLETED':
        return '#2ecc71';
      case 'CANCELLED':
        return '#ff0000';
      default:
        return '#000000';
    }
  };

  return (
    <Layout>
      <ToastContainer
  autoClose={3000}
  hideProgressBar={false}
  closeOnClick
  pauseOnHover
  draggable
  pauseOnFocusLoss
  position="top-center" // ยังต้องใส่ไว้
  toastClassName="centered-toast"
  containerStyle={{
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 9999,
  }}
/>


      <div className="dashboard-bg">
        <div className="ticket-form">
          <h1>สร้าง Ticket</h1>

          {message && (
            <div className="bg-green-100 text-green-700 p-2 mb-4 text-center">{message}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-row">
 
<div className="input-group" style={{ position: 'relative' }}>
  <label>รหัสสาขา</label>
  <input
    type="text"
    className="branch-input"
    value={branchCode}
    autoComplete="off"
    placeholder="พิมพ์รหัสสาขา..."
    onFocus={() => setShowBranchDropdown(true)}
    onBlur={() => setTimeout(() => setShowBranchDropdown(false), 150)}
    onChange={(e) => {
      const value = e.target.value.toUpperCase();
      setBranchCode(value);
      setShowBranchDropdown(true);
    }}
    required
  />
  {showBranchDropdown && branchCode && (
    <div className="branch-dropdown">
      {branchCodes
        .filter((b) =>
          b.branchCode.toLowerCase().startsWith(branchCode.toLowerCase())
        )
        .slice(0, 10)
        .map((b) => (
          <div
            key={b._id}
            className="branch-dropdown-item"
            onMouseDown={() => {
              setBranchCode(`${b.branchCode} - ${b.branchName}`);
              setShowBranchDropdown(false);
            }}
          >
            <span className="branch-dropdown-icon">🏢</span>
              <span className="branch-dropdown-text">
                {b.branchCode} - {b.branchName}
              </span>
          </div>
        ))}
      {branchCodes.filter((b) =>
        b.branchCode.toLowerCase().startsWith(branchCode.toLowerCase())
      ).length === 0 && (
        <div className="branch-dropdown-item branch-dropdown-noresult">
          ไม่พบรหัสสาขา
        </div>
      )}
    </div>
  )}
</div>



              <div className="input-group">
                <label>หมายเลข AnyDesk (ไม่บังคับ)</label>
                <input
                  type="text"
                  value={anydeskNumber}
                  onChange={(e) => setAnydeskNumber(e.target.value)}
                />
              </div>
            </div>

            <div className="input-group">
              <label>รายละเอียดปัญหา</label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>ประเภทปัญหา</label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                required
              >
                <option value="แจ้งปัญหาการใช้งานทั่วไป">แจ้งปัญหาการใช้งานทั่วไป</option>
                <option value="เบิก/เปลี่ยนอุปกรณ์">เบิก/เปลี่ยนอุปกรณ์</option>
              </select>
            </div>

            <div className="input-group">
              <label>แนบไฟล์ (ถ้ามี)</label>
               <input
        type="file"
        onChange={handleFileChange}
        ref={fileInputRef}  // ✅ Step 3
      />
            </div>

            <button type="submit">ส่ง Ticket</button>
          </form>

          <hr className="my-6" />

          <h2 className="text-xl font-semibold mb-2 text-center mt-6">ประวัติการส่ง Ticket</h2>
          {userTickets.length === 0 ? (
            <p className="text-center">ยังไม่มีรายการที่ส่ง</p>
          ) : (
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full table-auto border border-gray-300 bg-white text-black rounded">
                <thead>
                  <tr className="bg-gray-100 text-black">
                    <th className="px-4 py-2 border">วันที่</th>
                    <th className="px-4 py-2 border">รหัสสาขา</th>
                    <th className="px-4 py-2 border">รายละเอียด</th>
                    <th className="px-4 py-2 border">สถานะ</th>
                    <th className="px-4 py-2 border">ประเภท</th>
                  </tr>
                </thead>
                <tbody>
                  {userTickets.map(ticket => (
                    <tr key={ticket._id}>
                      <td className="px-4 py-2 border">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 border">{ticket.branchCode || 'N/A'}</td>
                      <td className="px-4 py-2 border">{ticket.details}</td>
                      <td
                        className="px-4 py-2 border"
                        style={{ color: getStatusColor(ticket.status) }}
                      >
                        {ticket.status || 'WAIT FOR ASSET'}
                      </td>
                      <td className="px-4 py-2 border">{ticket.issueType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default UserDashboard;
