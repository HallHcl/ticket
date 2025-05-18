const mongoose = require('mongoose');

const BranchSchema = new mongoose.Schema({
  branchCode: {
    type: String,
    required: true,
  },
    branchName: {
    type: String,
    required: true,
  }
});

const Branch = mongoose.model('Branch', BranchSchema);

module.exports = Branch;