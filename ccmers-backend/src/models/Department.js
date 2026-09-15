const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  deptId: {
    type: String,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Department name is required'],
    unique: true,
    trim: true
  },
  head: {
    type: String,
    default: 'Unassigned'
  },
  contact: {
    type: String,
    default: ''
  },
  staffCount: {
    type: Number,
    default: 0
  },
  activeIncidents: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Department', departmentSchema);
