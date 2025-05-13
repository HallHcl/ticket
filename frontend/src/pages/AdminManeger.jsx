import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavAdmin from '../components/NavbarAdmin';
import './AdminManeger.css';

const AdminManager = () => {
  const [staff, setStaff] = useState([]);
  const [newStaff, setNewStaff] = useState({
    firstName: '',
    lastName: '',
    position: '',
    phone: '',
    email: '',
    description: '',
    profilePic: null,
  });
  const [showAlert, setShowAlert] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);

  // Effect to prevent scrolling when alert is open
  useEffect(() => {
    if (showAlert) {
      // Prevent background scrolling when alert is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showAlert]);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/it-staff');
        setStaff(response.data);
      } catch (error) {
        console.error('Error fetching staff', error);
      }
    };
    fetchStaff();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePic') {
      setNewStaff((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setNewStaff((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(newStaff).forEach((key) => {
      formData.append(key, newStaff[key]);
    });

    try {
      if (newStaff._id) {
        // ถ้ามี _id ก็เป็นการอัพเดต
        await axios.put(`http://localhost:5000/api/it-staff/${newStaff._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        // ถ้าไม่มี _id ก็เป็นการเพิ่ม
        await axios.post('http://localhost:5000/api/it-staff', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      setNewStaff({
        firstName: '',
        lastName: '',
        position: '',
        phone: '',
        email: '',
        description: '',
        profilePic: null,
      });

      const response = await axios.get('http://localhost:5000/api/it-staff');
      setStaff(response.data);
    } catch (error) {
      console.error('Error saving staff data', error);
    }
  };

  const handleDeleteStaff = async (id) => {
    setStaffToDelete(id);
    setShowAlert(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/it-staff/${staffToDelete}`);
      const response = await axios.get('http://localhost:5000/api/it-staff');
      setStaff(response.data);
      setShowAlert(false); // ปิด alert
    } catch (error) {
      console.error('Error deleting staff', error);
    }
  };

  const handleCancelDelete = () => {
    setShowAlert(false); // ปิด alert
  };

  const handleEdit = (staffMember) => {
    setNewStaff({
      firstName: staffMember.firstName,
      lastName: staffMember.lastName,
      position: staffMember.position,
      phone: staffMember.phone,
      email: staffMember.email,
      description: staffMember.description,
      profilePic: staffMember.profilePic,
      _id: staffMember._id, // เพิ่ม _id สำหรับการแก้ไข
    });
  };

  return (
    <NavAdmin>
   
    {/* Main Container */}
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">IT Staff Manager</h1>

      {/* Form Section */}
      <div className="flex justify-center mb-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 justify-center mb-6 max-w-4xl mx-auto">
          <div className="form-row">
            <div className="input-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={newStaff.firstName}
                onChange={handleChange}
                className="border border-gray-300 rounded px-3 py-2 w-full"
              />
            </div>
            <div className="input-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={newStaff.lastName}
                onChange={handleChange}
                className="border border-gray-300 rounded px-3 py-2 w-full"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label>Position</label>
              <input
                type="text"
                name="position"
                value={newStaff.position}
                onChange={handleChange}
                className="border border-gray-300 rounded px-3 py-2 w-full"
              />
            </div>

            <div className="input-group">
              <label>Phone</label>
              <input
                type="text"
                name="phone"
                value={newStaff.phone}
                onChange={handleChange}
                className="border border-gray-300 rounded px-3 py-2 w-full"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={newStaff.email}
                onChange={handleChange}
                className="border border-gray-300 rounded px-3 py-2 w-full"
              />
            </div>

            <div className="input-group">
              <label>Description</label>
              <input
                type="text"
                name="description"
                value={newStaff.description}
                onChange={handleChange}
                className="border border-gray-300 rounded px-3 py-2 w-full"
              />
            </div>
          </div>

          <div className="input-group">
            <label>Profile Picture</label>
            <input
              type="file"
              name="profilePic"
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 w-full"
            />
          </div>

          <div className="col-span-2 flex justify-center">
            <button
              type="submit"
              className="bg-pink-800 hover:bg-pink-700 text-white px-6 py-2 rounded-md shadow-md"
            >
              {newStaff._id ? 'Save Changes' : 'Add Staff'}
            </button>
          </div>
        </form>
      </div>

      {/* Table Section */}
      <div className="table-allstaff">

        <table className="table-auto w-full border-collapse">

        <thead className="table-header">
            <tr>
                <th className="cell">First Name</th>
                <th className="cell">Last Name</th>
                <th className="cell">Position</th>
                <th className="cell">Phone</th>
                <th className="cell">Email</th>
                <th className="cell">Actions</th>
            </tr>
        </thead>

          <tbody>
            {staff.map((staffMember) => (
             <tr key={staffMember._id} className="hover-row">
             <td className="cell">{staffMember.firstName}</td>
             <td className="cell">{staffMember.lastName}</td>
             <td className="cell">{staffMember.position}</td>
             <td className="cell">{staffMember.phone}</td>
             <td className="cell">{staffMember.email}</td>
             <td className="cell buttons">
               <button
                 onClick={() => handleEdit(staffMember)}
                 className="edit-btn"
               >
                 Edit
               </button>
               <button
                 onClick={() => handleDeleteStaff(staffMember._id)}
                 className="delete-btn"
               >
                 Delete
               </button>
             </td>
           </tr>           
            
            ))}
          </tbody>
        </table>
      </div>

</div>

      {/* Delete Confirmation Alert - Fixed Position */}
      {showAlert && (
        <div className="alert-overlay">
            <div className="alert-box">
            <h2>Are you sure?</h2>
            <p>This action cannot be undone.</p>
            <div className="alert-buttons">
                <button className="cancel" onClick={handleCancelDelete}>Cancel</button>
                <button className="confirm" onClick={handleConfirmDelete}>Yes, delete it!</button>
            </div>
            </div>
        </div>
        )}
  </NavAdmin>

  );
};

export default AdminManager;