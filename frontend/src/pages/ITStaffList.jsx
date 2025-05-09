import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Modal, Button } from 'react-bootstrap';
import './ITStaffTree.css';

const SUPER_LEADER_ID = '68177206d444cdb6425d74a5';
const LEADER_ID = '681799d46feee4bdd21630a3';

// สร้างลำดับตำแหน่งที่เราต้องการ
const positionRank = {
  'IT Service Manager - M1': 1,
  'IT Service Supervisor - SUP1': 2,
  'Technical Service Agent - SU2': 3,
  'Technical Service Agent': 4,
};

const ITStaffList = () => {
  const [staffData, setStaffData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPosition, setFilterPosition] = useState('');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/it-staff')
      .then(response => response.json())
      .then(data => setStaffData(data))
      .catch(error => console.error('Error fetching IT staff data:', error));
  }, []);

  const leader = staffData.find(person => person._id === LEADER_ID) || null;
  const superLeader = staffData.find(person => person._id === SUPER_LEADER_ID) || null;
  const subordinates = staffData.filter(
    person => person._id !== LEADER_ID && person._id !== SUPER_LEADER_ID
  );

  // ฟังก์ชันเพื่อจัดเรียงพนักงานตามลำดับตำแหน่ง
  const sortByPosition = (a, b) => {
    const rankA = positionRank[a.position] || Infinity; // ถ้าตำแหน่งไม่อยู่ในลิสต์ จะถูกจัดเป็นอันดับสุดท้าย
    const rankB = positionRank[b.position] || Infinity;
    return rankA - rankB;
  };

  const filterMatch = person =>
    (person.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.lastName.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!filterPosition || person.position === filterPosition);

  const filteredSubordinates = subordinates.filter(filterMatch).sort(sortByPosition);
  const isLeaderMatchingSearch = leader && filterMatch(leader);
  const isSuperLeaderMatchingSearch = superLeader && filterMatch(superLeader);

  const handleStaffClick = person => {
    setSelectedStaff(person);
    setShowModal(true);
  };

  return (
    <Layout>
      <div className="container-staff">
        <div className="search-filter">
          <input
            type="text"
            placeholder="🔍 ค้นหาพนักงาน..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <select value={filterPosition} onChange={e => setFilterPosition(e.target.value)}>
            <option value="">📌 ทุกตำแหน่ง</option>
            {[...new Set(staffData.map(person => person.position))].map(position => (
              <option key={position} value={position}>{position}</option>
            ))}
          </select>
        </div>

        <div className="staff-tree">
          {isSuperLeaderMatchingSearch && superLeader && (
            <div className="super-leader">
              <div className="staff-card super-leader-card" onClick={() => handleStaffClick(superLeader)}>
                <img src={`http://localhost:5000${superLeader.profilePic}`} alt="Profile" className="profile-pic" />
                <h3>{superLeader.firstName} {superLeader.lastName}</h3>
                <div className="staff-info">
                  <p><strong>Position:</strong> {superLeader.position}</p>
                  <p><strong>📞 3CX:</strong> {superLeader.phone}</p>
                  <p><strong>✉️ E-mail:</strong> {superLeader.email}</p>
                </div>
              </div>
            </div>
          )}

          {isLeaderMatchingSearch && leader && (
            <div className="leader">
              <div className="staff-card leader-card" onClick={() => handleStaffClick(leader)}>
                <img src={`http://localhost:5000${leader.profilePic}`} alt="Profile" className="profile-pic" />
                <h3>{leader.firstName} {leader.lastName}</h3>
                <div className="staff-info">
                  <p><strong>Position:</strong> {leader.position}</p>
                  <p><strong>📞 3CX:</strong> {leader.phone}</p>
                  <p><strong>✉️</strong> {leader.email}</p>
                </div>
              </div>
            </div>
          )}

          <div className="subordinates">
            {filteredSubordinates.length === 0 && !isLeaderMatchingSearch && !isSuperLeaderMatchingSearch ? (
              <p className="no-results">❌ ไม่พบพนักงานที่ตรงกับเงื่อนไข</p>
            ) : (
              filteredSubordinates.map(person => (
                <div key={person._id} className="staff-card" onClick={() => handleStaffClick(person)}>
                  <img src={`http://localhost:5000${person.profilePic}`} alt="Profile" className="profile-pic" />
                  <h3>{person.firstName} {person.lastName}</h3>
                  <div className="staff-info">
                    <p><strong>Position:</strong> {person.position}</p>
                    <p><strong>📞 3CX:</strong> {person.phone}</p>
                    <p><strong>✉️ E-mail</strong> {person.email}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {selectedStaff && (
        <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>ข้อมูลพนักงาน</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex flex-row">
              <div className="text-center w-50 border-end pe-3">
                <img
                  src={
                    selectedStaff.profilePic
                      ? `http://localhost:5000${selectedStaff.profilePic}`
                      : "https://via.placeholder.com/150"
                  }
                  alt="Profile Preview"
                  className="img-fluid rounded-circle mb-3"
                  style={{ width: "200px", height: "200px", objectFit: "cover" }}
                />
                <h5 className="mt-2 text-capitalize">
                  {selectedStaff.firstName} {selectedStaff.lastName}
                </h5>
              </div>

              <div className="ps-4 w-50">
                <p><strong>Position:</strong> {selectedStaff.position}</p>
                <p><strong>✉️ Email:</strong> {selectedStaff.email}</p>
                <p><strong>📞 3CX:</strong> {selectedStaff.phone}</p>
                <p><strong>📝 Description:</strong> {selectedStaff.description || "ไม่มีข้อมูลเพิ่มเติม"}</p>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>ปิด</Button>
          </Modal.Footer>
        </Modal>
      )}

    </Layout>
  );
};

export default ITStaffList;
