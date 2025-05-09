const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  lastLogin: { type: Date, default: null } // ✅ เพิ่มตรงนี้
});

module.exports = mongoose.model('User', UserSchema);
