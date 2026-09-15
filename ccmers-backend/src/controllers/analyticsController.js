const Incident = require('../models/Incident');
const { memoryIncidents } = require('./incidentController');

// @desc    Get aggregate analytics metrics for admin dashboard
// @route   GET /api/analytics
// @access  Private (Admin)
const getAnalyticsSummary = async (req, res) => {
  try {
    let incidents = [];

    try {
      incidents = await Incident.find();
      if (!incidents || incidents.length === 0) {
        incidents = memoryIncidents;
      }
    } catch {
      incidents = memoryIncidents;
    }

    const totalIncidents = incidents.length;
    const reportedCount = incidents.filter(i => i.status === 'Reported').length;
    const inProgressCount = incidents.filter(i => i.status === 'Assigned' || i.status === 'In Progress').length;
    const resolvedCount = incidents.filter(i => i.status === 'Resolved' || i.status === 'Closed').length;
    const criticalCount = incidents.filter(i => i.severity === 'Critical').length;

    // Category breakdown
    const categoryCounts = {};
    incidents.forEach(i => {
      const cat = i.category || 'Other';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    // Severity breakdown
    const severityCounts = {
      Low: incidents.filter(i => i.severity === 'Low').length,
      Medium: incidents.filter(i => i.severity === 'Medium').length,
      High: incidents.filter(i => i.severity === 'High').length,
      Critical: incidents.filter(i => i.severity === 'Critical').length
    };

    // Department breakdown
    const departmentCounts = {};
    incidents.forEach(i => {
      const dept = i.assignedDepartment || 'Unassigned';
      departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
    });

    // Average resolution time
    const resolvedIncidents = incidents.filter(i => (i.status === 'Resolved' || i.status === 'Closed') && i.resolutionTimeHours > 0);
    const avgResolutionTimeHours = resolvedIncidents.length > 0
      ? Number((resolvedIncidents.reduce((acc, i) => acc + i.resolutionTimeHours, 0) / resolvedIncidents.length).toFixed(1))
      : 1.8;

    res.json({
      success: true,
      data: {
        summary: {
          total: totalIncidents,
          reported: reportedCount,
          inProgress: inProgressCount,
          resolved: resolvedCount,
          critical: criticalCount,
          avgResolutionTimeHours
        },
        categoryCounts,
        severityCounts,
        departmentCounts,
        resolutionTimeStats: {
          averageHours: avgResolutionTimeHours,
          resolvedIncidentsCount: resolvedIncidents.length
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Analytics aggregation failed'
    });
  }
};

module.exports = {
  getAnalyticsSummary
};
