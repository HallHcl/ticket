const mongoose = require('mongoose');

const ITStaffSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  position: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  profilePic: { type: String },  
  description: { type: String }, 
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'ITStaff' }  // ฟิลด์สำหรับการเชื่อมโยงกับผู้จัดการ
});

const ITStaff = mongoose.model('ITStaff', ITStaffSchema);

module.exports = ITStaff;
