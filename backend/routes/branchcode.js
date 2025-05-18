const express = require('express');
const router = express.Router();
const Branch = require('../models/branch'); // เพิ่มการ import model

// GET: ดึงข้อมูล branchcode ทั้งหมดจาก database
router.get('/getbranchcode', async (req, res) => {
  try {
    const branches = await Branch.find();
    res.json(branches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST: เพิ่ม branchcode ใหม่ลง database
router.post('/postbranchcode', async (req, res) => {
  const branches = req.body; // คาดว่า req.body จะเป็น array ของ objects

  if (!Array.isArray(branches)) {
    return res.status(400).json({ message: 'ต้องส่งข้อมูลเป็น array' });
  }

  for (const branch of branches) {
    if (!branch.branchCode || !branch.branchName) {
      return res.status(400).json({ message: 'branchCode และ branchName ทุกตัวต้องมี' });
    }
  }

  try {
    const newBranches = await Branch.insertMany(branches);
    res.status(201).json(newBranches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;