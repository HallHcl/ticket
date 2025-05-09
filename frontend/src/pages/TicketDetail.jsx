import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NavAdmin from '../components/NavbarAdmin';
import './TicketDetail.css';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
 
const TicketDetail = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuthorizationAndFetch = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          if (decoded.role === 'admin') {
            setIsAuthorized(true);
            try {
              const res = await axios.get(`http://localhost:5000/api/tickets/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              setTicket(res.data);
              setLoading(false);
            } catch (err) {
              setError('ไม่สามารถโหลดข้อมูล Ticket ได้');
              setLoading(false);
            }
          } else {
            setLoading(false);
            setError('เข้าถึงไม่ได้: ต้องเป็นผู้ดูแลระบบ');
          }
        } catch (err) {
          setLoading(false);
          setError('Token ไม่ถูกต้อง');
        }
      } else {
        setLoading(false);
        setError('กรุณาเข้าสู่ระบบก่อน');
      }
    };

    checkAuthorizationAndFetch();
  }, [id]);

  if (loading) return <div>กำลังโหลดข้อมูล...</div>;

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h3>เกิดข้อผิดพลาด</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="access-denied">
        <div className="access-denied-icon">🔒</div>
        <h2>การเข้าถึงถูกปฏิเสธ</h2>
        <p>คุณต้องเป็นผู้ดูแลระบบเพื่อดูหน้านี้</p>
      </div>
    );
  }

  return (
    <NavAdmin>
      <div className="ticket-detail-container">
        <div className="ticket-header">
          <h2>ประเภทปัญหา: <span className="ticket-issue-type">{ticket.issueType}</span></h2>
        </div>
        <div className="ticket-info">
          <div className="ticket-info-item">
            <strong>รหัสสาขา:</strong>
            <span>{ticket.branchCode}</span>
          </div>
          <div className="ticket-info-item">
            <strong>หมายเลข AnyDesk:</strong>
            <span>{ticket.anydeskNumber || 'ไม่ได้ระบุ'}</span>
          </div>
          <div className="ticket-info-item">
            <strong>รายละเอียด:</strong>
            <span>{ticket.details}</span>
          </div>
          <div className="ticket-info-item">
            <strong>สถานะ:</strong>
            <span className={`ticket-status ${ticket.status.toLowerCase()}`}>{ticket.status}</span>
          </div>
          <div className="ticket-info-item">
            <strong>วันที่แจ้ง:</strong>
            <span>{new Date(ticket.createdAt).toLocaleString('th-TH')}</span>
          </div>
        </div>

        {ticket.attachment && (
          <div className="attachment-container">
            <strong>ไฟล์แนบ:</strong>
            <div className="attachment-image">
              <img
                src={`http://localhost:5000${ticket.attachment}`}
                alt="Ticket Attachment"
              />
            </div>
          </div>
        )}
      </div>
    </NavAdmin>
  );
};

export default TicketDetail;
