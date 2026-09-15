const Department = require('../models/Department');

let memoryDepartments = [
  {
    id: 'dept-1',
    deptId: 'dept-1',
    name: 'Campus Security',
    head: 'Capt. Officer Carter',
    contact: 'ext. 9110',
    staffCount: 18,
    activeIncidents: 3
  },
  {
    id: 'dept-2',
    deptId: 'dept-2',
    name: 'Medical Response',
    head: 'Dr. Sarah Jenkins',
    contact: 'ext. 9111',
    staffCount: 12,
    activeIncidents: 1
  },
  {
    id: 'dept-3',
    deptId: 'dept-3',
    name: 'Facilities & Maintenance',
    head: 'Eng. Elena Rostova',
    contact: 'ext. 9112',
    staffCount: 25,
    activeIncidents: 2
  },
  {
    id: 'dept-4',
    deptId: 'dept-4',
    name: 'IT Support',
    head: 'Evan Wright',
    contact: 'ext. 9113',
    staffCount: 10,
    activeIncidents: 1
  }
];

// @desc    Get all departments
// @route   GET /api/departments
// @access  Private
const getAllDepartments = async (req, res) => {
  try {
    let depts;
    try {
      depts = await Department.find();
      if (!depts || depts.length === 0) {
        depts = memoryDepartments;
      }
    } catch {
      depts = memoryDepartments;
    }

    res.json({
      success: true,
      count: depts.length,
      data: depts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get department by ID
// @route   GET /api/departments/:id
// @access  Private
const getDepartmentById = async (req, res) => {
  try {
    const deptId = req.params.id;
    let dept;
    try {
      dept = await Department.findOne({ $or: [{ id: deptId }, { deptId }, { _id: deptId }] });
    } catch {
      // ignore
    }

    if (!dept) {
      dept = memoryDepartments.find(d => d.id === deptId || d.deptId === deptId || d._id === deptId);
    }

    if (!dept) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    res.json({
      success: true,
      data: dept
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new department
// @route   POST /api/departments
// @access  Private (Admin)
const createDepartment = async (req, res) => {
  try {
    const { name, head, contact, staffCount } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Department name is required'
      });
    }

    const deptId = `dept-${Date.now()}`;
    const newDeptObj = {
      id: deptId,
      deptId,
      name,
      head: head || 'Unassigned',
      contact: contact || '',
      staffCount: staffCount !== undefined ? Number(staffCount) : 0,
      activeIncidents: 0
    };

    let createdDept;
    try {
      createdDept = await Department.create(newDeptObj);
    } catch {
      memoryDepartments.push(newDeptObj);
      createdDept = newDeptObj;
    }

    res.status(201).json({
      success: true,
      message: 'Department created successfully',
      data: createdDept
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update department
// @route   PUT /api/departments/:id
// @access  Private (Admin)
const updateDepartment = async (req, res) => {
  try {
    const deptId = req.params.id;
    const { name, head, contact, staffCount, activeIncidents } = req.body;

    let updated;
    try {
      updated = await Department.findOneAndUpdate(
        { $or: [{ id: deptId }, { deptId }, { _id: deptId }] },
        { name, head, contact, staffCount, activeIncidents },
        { new: true }
      );
    } catch {
      // ignore
    }

    const index = memoryDepartments.findIndex(d => d.id === deptId || d.deptId === deptId || d._id === deptId);
    if (index !== -1) {
      memoryDepartments[index] = {
        ...memoryDepartments[index],
        name: name || memoryDepartments[index].name,
        head: head || memoryDepartments[index].head,
        contact: contact || memoryDepartments[index].contact,
        staffCount: staffCount !== undefined ? Number(staffCount) : memoryDepartments[index].staffCount,
        activeIncidents: activeIncidents !== undefined ? Number(activeIncidents) : memoryDepartments[index].activeIncidents
      };
      if (!updated) updated = memoryDepartments[index];
    }

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    res.json({
      success: true,
      message: 'Department updated successfully',
      data: updated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete department
// @route   DELETE /api/departments/:id
// @access  Private (Admin)
const deleteDepartment = async (req, res) => {
  try {
    const deptId = req.params.id;
    try {
      await Department.findOneAndDelete({ $or: [{ id: deptId }, { deptId }, { _id: deptId }] });
    } catch {
      // ignore
    }

    memoryDepartments = memoryDepartments.filter(d => d.id !== deptId && d.deptId !== deptId && d._id !== deptId);

    res.json({
      success: true,
      message: `Department ${deptId} deleted successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  memoryDepartments
};
