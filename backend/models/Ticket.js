const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  branchCode: {
    type: String,
    required: true,
  },
  anydeskNumber: {
    type: String,
    required: false,
  },
  details: {
    type: String,
    required: true,
  },
  issueType: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'WAIT FOR ASSET', // ค่า default
    enum: ['WAIT FOR ASSET', 'WORK IN PROGRESS', 'CHECKING', 'PENDING', 'CANCELLED','COMPLETED'] // ตัวเลือกสถานะ
  },
  userId: {
    type: Number,  // เปลี่ยนเป็น Number
    required: true,
  },
  attachment: {
    type: String,
    required: false
  },  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
