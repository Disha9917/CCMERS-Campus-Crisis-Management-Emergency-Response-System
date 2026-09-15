const mongoose = require('mongoose');
const Incident = require('../models/Incident');

// In-memory fallback array initialized with initial mock incidents
let memoryIncidents = [
  {
    id: "INC-1001",
    title: "Chemistry Lab Chemical Spill",
    category: "Hazardous / Chemical",
    location: "Science Block - Room 204",
    description: "Small chemical spill (Solvent A) near Fume Hood 3 during morning lab session.",
    severity: "Critical",
    status: "In Progress",
    date: "2026-09-12",
    dateTime: "2026-09-12 09:30 AM",
    assignedDepartment: "Medical Response",
    assignedTo: "Dr. Sarah Jenkins",
    resolutionRemarks: "",
    reportedBy: "STU-2023-4412",
    reporterName: "Alex Mercer",
    resolutionTimeHours: 0,
    image: ""
  },
  {
    id: "INC-1002",
    title: "Suspicious Unattended Bag Near Cafeteria",
    category: "Security",
    location: "Main Student Center - East Entrance",
    description: "Black backpack left unobserved near table 14 for over 45 minutes.",
    severity: "High",
    status: "Assigned",
    date: "2026-09-12",
    dateTime: "2026-09-12 11:15 AM",
    assignedDepartment: "Campus Security",
    assignedTo: "Capt. Officer Carter",
    resolutionRemarks: "",
    reportedBy: "STU-2023-4412",
    reporterName: "Alex Mercer",
    resolutionTimeHours: 0,
    image: ""
  },
  {
    id: "INC-1003",
    title: "Main Library Elevator Fault & Entrapment Alert",
    category: "Maintenance",
    location: "Central Library - Elevator B",
    description: "Elevator stuck between 2nd and 3rd floor. Lights functional, emergency bell rang.",
    severity: "Medium",
    status: "Resolved",
    date: "2026-09-11",
    dateTime: "2026-09-11 02:20 PM",
    assignedDepartment: "Facilities & Maintenance",
    assignedTo: "Eng. Elena Rostova",
    resolutionRemarks: "Technician safely dispatched and occupants rescued. Relay switch replaced.",
    reportedBy: "STU-2023-4412",
    reporterName: "Alex Mercer",
    resolutionTimeHours: 1.5,
    image: ""
  },
  {
    id: "INC-1004",
    title: "Dormitory 4 Water Pipe Leakage",
    category: "Infrastructure",
    location: "Block D Dorms - 1st Floor Hallway",
    description: "Water leaking from ceiling pipe near Room 112 causing wet slippery corridor.",
    severity: "Low",
    status: "Closed",
    date: "2026-09-10",
    dateTime: "2026-09-10 08:45 AM",
    assignedDepartment: "Facilities & Maintenance",
    assignedTo: "Eng. Elena Rostova",
    resolutionRemarks: "Main valve turned off temporarily and pipe patch installed.",
    reportedBy: "STU-2023-5102",
    reporterName: "Jordan Hayes",
    resolutionTimeHours: 2.0,
    image: ""
  },
  {
    id: "INC-1005",
    title: "Campus Wi-Fi & Emergency Intercom Network Outage",
    category: "IT / Cyber",
    location: "Tech Park & Admin Building",
    description: "Core switch offline causing emergency panic button relay failure in North Zone.",
    severity: "Critical",
    status: "Reported",
    date: "2026-09-13",
    dateTime: "2026-09-13 01:05 AM",
    assignedDepartment: "IT Support",
    assignedTo: "Evan Wright",
    resolutionRemarks: "",
    reportedBy: "FAC-2022-1088",
    reporterName: "Prof. David Miller",
    resolutionTimeHours: 0,
    image: ""
  }
];

const getIdQuery = (incidentId) => {
  if (mongoose.Types.ObjectId.isValid(incidentId) && String(new mongoose.Types.ObjectId(incidentId)) === incidentId) {
    return { $or: [{ id: incidentId }, { _id: incidentId }] };
  }
  return { id: incidentId };
};

// @desc    Create new incident
// @route   POST /api/incidents
// @access  Private (Student, Admin)
const createIncident = async (req, res) => {
  try {
    const { title, category, location, description, severity } = req.body;

    if (!title || !category || !location || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all required incident fields'
      });
    }

    const incidentId = `INC-${Math.floor(1000 + Math.random() * 9000)}`;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : (req.body.image || '');

    const newIncidentObj = {
      id: incidentId,
      title,
      category,
      location,
      description,
      severity: severity || 'Medium',
      status: 'Reported',
      reportedBy: req.user ? (req.user.id || req.user.userId || 'STU-2023-4412') : 'STU-2023-4412',
      reporterName: req.user ? req.user.name : 'Student User',
      assignedDepartment: 'Unassigned',
      assignedTo: 'Unassigned',
      resolutionRemarks: '',
      resolutionTimeHours: 0,
      image: imagePath,
      date: new Date().toISOString().split('T')[0],
      dateTime: new Date().toLocaleString()
    };

    memoryIncidents.unshift(newIncidentObj);

    let savedIncident;
    try {
      savedIncident = await Incident.create(newIncidentObj);
    } catch {
      savedIncident = newIncidentObj;
    }

    res.status(201).json({
      success: true,
      message: 'Incident reported successfully',
      data: savedIncident || newIncidentObj
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create incident'
    });
  }
};

// @desc    Get all incidents (Admin view)
// @route   GET /api/incidents
// @access  Private (Admin)
const getAllIncidents = async (req, res) => {
  try {
    let incidents;
    try {
      incidents = await Incident.find().sort({ createdAt: -1 });
      if (!incidents || incidents.length === 0) {
        incidents = memoryIncidents;
      }
    } catch {
      incidents = memoryIncidents;
    }

    res.json({
      success: true,
      count: incidents.length,
      data: incidents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get incidents by current user (Student view)
// @route   GET /api/incidents/my
// @access  Private (Student)
const getMyIncidents = async (req, res) => {
  try {
    const userId = req.user ? (req.user.id || req.user.userId) : 'STU-2023-4412';
    
    let incidents;
    try {
      incidents = await Incident.find({
        $or: [{ reportedBy: userId }, { reportedBy: 'STU-2023-4412' }]
      }).sort({ createdAt: -1 });

      if (!incidents || incidents.length === 0) {
        incidents = memoryIncidents.filter(i => i.reportedBy === userId || i.reportedBy === 'STU-2023-4412');
      }
    } catch {
      incidents = memoryIncidents.filter(i => i.reportedBy === userId || i.reportedBy === 'STU-2023-4412');
    }

    res.json({
      success: true,
      count: incidents.length,
      data: incidents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get incidents assigned to department (Response team view)
// @route   GET /api/incidents/department
// @access  Private (Response, Admin)
const getDepartmentIncidents = async (req, res) => {
  try {
    const userDept = req.user ? (req.user.department || 'Campus Security') : 'Campus Security';
    
    let incidents;
    try {
      incidents = await Incident.find({
        $or: [
          { assignedDepartment: userDept },
          { assignedDepartment: 'Campus Security' },
          { assignedDepartment: 'Unassigned' }
        ]
      }).sort({ createdAt: -1 });

      if (!incidents || incidents.length === 0) {
        incidents = memoryIncidents.filter(i => 
          i.assignedDepartment === userDept || i.assignedDepartment === 'Campus Security' || i.assignedDepartment === 'Unassigned'
        );
      }
    } catch {
      incidents = memoryIncidents.filter(i => 
        i.assignedDepartment === userDept || i.assignedDepartment === 'Campus Security' || i.assignedDepartment === 'Unassigned'
      );
    }

    res.json({
      success: true,
      count: incidents.length,
      data: incidents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get incident by ID
// @route   GET /api/incidents/:id
// @access  Private
const getIncidentById = async (req, res) => {
  try {
    const incidentId = req.params.id;

    let incident;
    try {
      incident = await Incident.findOne(getIdQuery(incidentId));
    } catch {
      // ignore
    }

    if (!incident) {
      incident = memoryIncidents.find(i => i.id === incidentId || i._id === incidentId);
    }

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found'
      });
    }

    res.json({
      success: true,
      data: incident
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update incident status & remarks (Response Team)
// @route   PATCH /api/incidents/:id/status
// @access  Private (Response, Admin)
const updateIncidentStatus = async (req, res) => {
  try {
    const incidentId = req.params.id;
    const { status, resolutionRemarks, resolutionTimeHours } = req.body;

    let updated;
    try {
      updated = await Incident.findOneAndUpdate(
        getIdQuery(incidentId),
        { 
          status, 
          resolutionRemarks: resolutionRemarks !== undefined ? resolutionRemarks : '',
          resolutionTimeHours: resolutionTimeHours !== undefined ? Number(resolutionTimeHours) : 0.5
        },
        { new: true }
      );
    } catch {
      // Memory update fallback
    }

    // Memory array update
    const memIndex = memoryIncidents.findIndex(i => i.id === incidentId || i._id === incidentId);
    if (memIndex !== -1) {
      memoryIncidents[memIndex] = {
        ...memoryIncidents[memIndex],
        status: status || memoryIncidents[memIndex].status,
        resolutionRemarks: resolutionRemarks !== undefined ? resolutionRemarks : memoryIncidents[memIndex].resolutionRemarks,
        resolutionTimeHours: resolutionTimeHours !== undefined ? Number(resolutionTimeHours) : memoryIncidents[memIndex].resolutionTimeHours
      };
      if (!updated) updated = memoryIncidents[memIndex];
    }

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found for status update'
      });
    }

    res.json({
      success: true,
      message: `Incident ${incidentId} status updated to ${status}`,
      data: updated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Assign incident to department & set severity (Admin)
// @route   PATCH /api/incidents/:id/assign
// @access  Private (Admin)
const assignIncident = async (req, res) => {
  try {
    const incidentId = req.params.id;
    const { assignedDepartment, assignedTo, severity, status } = req.body;

    let updated;
    try {
      const updateFields = {
        assignedDepartment,
        assignedTo: assignedTo || 'Department Team',
        status: status || 'Assigned'
      };
      if (severity) updateFields.severity = severity;

      updated = await Incident.findOneAndUpdate(
        getIdQuery(incidentId),
        updateFields,
        { new: true }
      );
    } catch {
      // memory fallback
    }

    const memIndex = memoryIncidents.findIndex(i => i.id === incidentId || i._id === incidentId);
    if (memIndex !== -1) {
      memoryIncidents[memIndex] = {
        ...memoryIncidents[memIndex],
        assignedDepartment: assignedDepartment || memoryIncidents[memIndex].assignedDepartment,
        assignedTo: assignedTo || memoryIncidents[memIndex].assignedTo || 'Department Team',
        severity: severity || memoryIncidents[memIndex].severity,
        status: status || 'Assigned'
      };
      if (!updated) updated = memoryIncidents[memIndex];
    }

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found for assignment'
      });
    }

    res.json({
      success: true,
      message: `Incident ${incidentId} assigned to ${assignedDepartment}`,
      data: updated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createIncident,
  getAllIncidents,
  getMyIncidents,
  getDepartmentIncidents,
  getIncidentById,
  updateIncidentStatus,
  assignIncident,
  memoryIncidents
};
