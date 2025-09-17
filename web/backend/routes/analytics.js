const express = require('express');
const Report = require('../models/Report');
const Department = require('../models/Department');
const router = express.Router();

// Get analytics dashboard data
router.get('/', async (req, res) => {
  try {
    // Basic stats
    const totalReports = await Report.countDocuments();
    const pendingReports = await Report.countDocuments({ 
      status: { $in: ['submitted', 'verified', 'assigned', 'in_progress'] } 
    });
    const resolvedReports = await Report.countDocuments({ status: 'resolved' });

    // Reports by category
    const reportsByCategory = await Report.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Reports by status
    const reportsByStatus = await Report.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Recent reports
    const recentReports = await Report.find()
      .populate('assignedDepartment', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      stats: {
        totalReports,
        pendingReports,
        resolvedReports,
        reportsByCategory,
        reportsByStatus
      },
      recentReports
    });

  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Server error fetching analytics' });
  }
});

// Get hotspots data
router.get('/hotspots', async (req, res) => {
  try {
    const hotspots = await Report.aggregate([
      {
        $group: {
          _id: {
            lat: { $round: [{ $arrayElemAt: ['$location.coordinates', 1] }, 3] },
            lng: { $round: [{ $arrayElemAt: ['$location.coordinates', 0] }, 3] }
          },
          count: { $sum: 1 },
          categories: { $push: '$category' }
        }
      },
      { $match: { count: { $gte: 2 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    res.json({ hotspots });

  } catch (error) {
    console.error('Hotspots error:', error);
    res.status(500).json({ message: 'Server error fetching hotspots' });
  }
});

module.exports = router;
