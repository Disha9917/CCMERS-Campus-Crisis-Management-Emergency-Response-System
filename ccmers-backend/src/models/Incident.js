const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true
  },
  title: {
    type: String,
    required: [true, 'Incident title is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    default: 'Other'
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Reported', 'Assigned', 'In Progress', 'Resolved', 'Closed'],
    default: 'Reported'
  },
  reportedBy: {
    type: String,
    default: 'STU-2023-0000'
  },
  reporterName: {
    type: String,
    default: 'Anonymous Student'
  },
  assignedDepartment: {
    type: String,
    default: 'Unassigned'
  },
  assignedTo: {
    type: String,
    default: 'Unassigned'
  },
  resolutionRemarks: {
    type: String,
    default: ''
  },
  resolutionTimeHours: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    default: ''
  },
  date: {
    type: String,
    default: () => new Date().toISOString().split('T')[0]
  },
  dateTime: {
    type: String,
    default: () => new Date().toLocaleString()
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Incident', incidentSchema);
