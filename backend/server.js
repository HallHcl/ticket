// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios'); // ✅ ใช้ axios สำหรับ fetch ข่าว
const ITStaff = require('./models/ITStaff');
const Ticket = require('./models/Ticket'); // เพิ่มบรรทัดนี้เพื่อ import Ticket model
const User = require('./models/User'); // Uncomment this line
const authRoutes = require('./routes/auth');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs'); // ใส่ไว้ด้านบนของไฟล์ หากยังไม่ได้ import
const app = express();
const port = 5000;

dotenv.config();

// Middleware
app.use(express.json());
app.use(cors());
const multer = require('multer');
const path = require('path');

// ตั้งค่า storage สำหรับ multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // เก็บไฟล์ไว้ในโฟลเดอร์นี้
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // ใช้ชื่อไฟล์แบบ unique
  }
});

const upload = multer({ storage });

// ให้ express เสิร์ฟไฟล์จาก /uploads เป็น static path
app.use('/uploads', express.static('uploads'));



// MongoDB connection (ลบ options ที่เลิกใช้)
mongoose.connect('mongodb+srv://hallkong:741852963@cluster0.cez7m.mongodb.net/IT?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

  // 📌 Proxy API ดึงข่าวจาก GNews (แก้ปัญหา CORS)
const API_KEY = "94853facc0e74c1d96a16e60ee0d5268";
const BASE_URL = 'https://newsapi.org/v2/everything';


// GET: Report tickets (all tickets, no date filter)
app.get('/api/tickets/report', async (req, res) => {
  try {
    const allTickets = await Ticket.find(); // ไม่มีเงื่อนไข filter

    const statusSummary = {
      'WAIT FOR ASSET': 0,
      'WORK IN PROGRESS': 0,
      'CHECKING': 0,
      'PENDING': 0,
      'COMPLETED': 0,
      'CANCELLED': 0 // ✅ เพิ่มสถานะนี้
    };
    

    allTickets.forEach(ticket => {
      if (statusSummary[ticket.status] !== undefined) {
        statusSummary[ticket.status]++;
      }
    });

    res.status(200).json({
      totalTickets: allTickets.length,
      statusSummary,
      tickets: allTickets
    });
  } catch (err) {
    console.error('Error generating report:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการสร้างรายงาน' });
  }
});

app.get('/api/tickets/:ticketId', async (req, res) => {  // ดึงข้อมูลตาม _id
  try {
    const ticket = await Ticket.findById(req.params.ticketId);  // ใช้ findById แทน
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch ticket' });
  }
});

app.get('/api/tickets/user/:userId', async (req, res) => {  // แก้เป็น /api/tickets/user/:userId
  try {
    const tickets = await Ticket.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

app.get('/api/tickets', async (req, res) => {
  try {
    const tickets = await Ticket.find();
    res.json(tickets);  // ส่งข้อมูล ticket กลับไปยัง frontend
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tickets', error: err });
  }
});

// POST endpoint to create a ticket
app.post('/api/tickets', upload.single('attachment'), async (req, res) => {
  const { branchCode, anydeskNumber, details, issueType, userId } = req.body;

  if (!branchCode || !details || !issueType || !userId ) {
    return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
  }

  try {
    const userExists = await User.findOne({ id: userId });
    if (!userExists) {
      return res.status(404).json({ message: 'ไม่พบผู้ใช้นี้ในระบบ' });
    }

    const newTicket = new Ticket({
      branchCode,
      anydeskNumber,
      details,
      issueType,
      userId,
      status: 'WAIT FOR ASSET',
      attachment: req.file ? `/uploads/${req.file.filename}` : null,
      createdAt: new Date()
    });

    await newTicket.save();
    res.status(201).json({ message: '', ticket: newTicket });
  } catch (err) {
    console.error('Error creating ticket:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการสร้าง ticket' });
  }
});

// PUT: Admin cancels a ticket by ticket _id
app.put('/api/tickets/:id/cancel', async (req, res) => {
  const ticketId = req.params.id;
  try {
    const ticket = await Ticket.findById(ticketId);

    // ตรวจสอบว่า ticket นี้มีอยู่หรือไม่
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // เปลี่ยนสถานะของ ticket เป็น CANCELLED
    ticket.status = 'CANCELLED';
    await ticket.save();

    // ส่งข้อมูลที่ถูกแก้ไขกลับ
    res.status(200).json({ message: 'Ticket cancelled successfully', ticket });
  } catch (err) {
    console.error('Error canceling ticket:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการยกเลิก ticket' });
  }
});

app.delete('/api/tickets/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.status(200).json({ message: 'Ticket deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting ticket', error: err.message });
  }
});

// PUT: Update ticket status by ticket _id only
app.put('/api/tickets/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: 'Status is required' });
  }

  try {
    const updatedTicket = await Ticket.findByIdAndUpdate(
      id,
      { status },
      { new: true } // return updated document
    );

    if (!updatedTicket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.status(200).json({ message: 'Status updated', ticket: updatedTicket });
  } catch (err) {
    console.error('Error updating ticket status:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET: Get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้' });
  }
});

// เปลี่ยน role ของผู้ใช้งาน
app.put('/api/users/:id/role', async (req, res) => {
  const { role } = req.body;

  if (!role) {
    return res.status(400).json({ message: 'Role is required' });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User role updated successfully',
      user,
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset password ให้ user
app.post('/api/users/:id/reset-password', async (req, res) => {
  try {
    const defaultPassword = 'NTB111223';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/news', async (req, res) => {
  try {
    const { q = 'ไอที' } = req.query;
    const response = await axios.get(BASE_URL, {
      params: {
        q,
        apiKey: API_KEY,
        language: 'th',
        sortBy: 'publishedAt',
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Error fetching news' });
  }
});

// API endpoint to get IT staff list
app.get('/api/it-staff', async (req, res) => {
  try {
    const staff = await ITStaff.find();
    res.json(staff);
  } catch (error) {
    console.error('Error fetching IT staff:', error);
    res.status(500).send('Error fetching IT staff');
  }
});

// POST endpoint for adding new IT staff
app.post('/api/it-staff', upload.single('profilePic'), async (req, res) => {
  const { firstName, lastName, position, phone, email, description } = req.body;
  const profilePic = req.file ? `/uploads/${req.file.filename}` : null;

  if (!firstName || !lastName || !position || !phone || !email) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newStaff = new ITStaff({
      firstName,
      lastName,
      position,
      phone,
      email,
      profilePic,    
      description,

    });
    
    await newStaff.save();
    res.status(201).json({ message: 'IT staff added successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error adding staff' });
  }
});

// PUT: Update IT staff by ID
app.put('/api/it-staff/:id', upload.single('profilePic'), async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, position, phone, email, description, managerId } = req.body;
  const profilePic = req.file ? `/uploads/${req.file.filename}` : null;

  if (!firstName || !lastName || !position || !phone || !email) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // ค้นหา IT staff ตาม ID
    const staff = await ITStaff.findById(id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    // อัปเดตข้อมูล IT staff
    staff.firstName = firstName;
    staff.lastName = lastName;
    staff.position = position;
    staff.phone = phone;
    staff.email = email;
    staff.description = description;
    staff.managerId = managerId;
    staff.profilePic = profilePic || staff.profilePic; // ใช้ profilePic เก่าถ้าไม่มีใหม่

    // บันทึกการเปลี่ยนแปลง
    await staff.save();

    res.status(200).json({ message: 'Staff updated successfully', staff });
  } catch (err) {
    console.error('Error updating staff:', err);
    res.status(500).json({ message: 'Error updating staff' });
  }
});

// DELETE: Delete IT staff by ID
app.delete('/api/it-staff/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // ค้นหาและลบ IT staff ตาม ID
    const staff = await ITStaff.findByIdAndDelete(id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    res.status(200).json({ message: 'Staff deleted successfully' });
  } catch (err) {
    console.error('Error deleting staff:', err);
    res.status(500).json({ message: 'Error deleting staff' });
  }
});



app.use('/api/auth', authRoutes);


// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
