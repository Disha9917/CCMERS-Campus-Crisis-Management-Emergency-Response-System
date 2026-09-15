const express = require('express');
const router = express.Router();
const {
  createIncident,
  getAllIncidents,
  getMyIncidents,
  getDepartmentIncidents,
  getIncidentById,
  updateIncidentStatus,
  assignIncident
} = require('../controllers/incidentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', protect, upload.single('image'), createIncident);
router.get('/', protect, authorize('admin'), getAllIncidents);
router.get('/my', protect, getMyIncidents);
router.get('/department', protect, authorize('response', 'admin'), getDepartmentIncidents);
router.get('/:id', protect, getIncidentById);
router.patch('/:id/status', protect, authorize('response', 'admin'), updateIncidentStatus);
router.patch('/:id/assign', protect, authorize('admin'), assignIncident);

module.exports = router;
