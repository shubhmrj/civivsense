const express = require('express');
const { body, validationResult } = require('express-validator');
const Report = require('../models/Report');
const User = require('../models/User');
const Department = require('../models/Department');
const router = express.Router();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Create a new report
router.post('/', [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').isIn(['pothole', 'garbage', 'streetlight', 'water', 'road', 'drainage', 'other']).withMessage('Invalid category'),
  body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude required'),
  body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      description,
      category,
      latitude,
      longitude,
      address,
      wardNumber,
      images,
      isAnonymous
    } = req.body;

    // Create report
    const report = new Report({
      title,
      description,
      category,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude]
      },
      address,
      wardNumber,
      images: images || [],
      isAnonymous: isAnonymous || false,
      reporter: isAnonymous ? null : req.user?.userId
    });

    await report.save();

    // Emit socket event for new report
    const io = req.app.get('io');
    if (io) {
      io.emit('report:new', report);
    }

    // Update user's total reports if not anonymous
    if (!isAnonymous && req.user?.userId) {
      await User.findByIdAndUpdate(req.user.userId, { $inc: { totalReports: 1 } });
    }

    res.status(201).json({
      message: 'Report created successfully',
      report
    });

  } catch (error) {
    console.error('Create report error:', error);
    res.status(500).json({ message: 'Server error creating report' });
  }
});

// Get all reports with filtering
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      category,
      assignedDepartment,
      latitude,
      longitude,
      radius = 5000 // 5km default
    } = req.query;

    const query = {};
    
    // Add filters
    if (status) query.status = status;
    if (category) query.category = category;
    if (assignedDepartment) query.assignedDepartment = assignedDepartment;

    // Add location filter if provided
    if (latitude && longitude) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(radius)
        }
      };
    }

    const reports = await Report.find(query)
      .populate('reporter', 'name phoneNumber')
      .populate('assignedDepartment', 'name contactEmail')
      .populate('assignedStaff', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Report.countDocuments(query);

    res.json({
      reports,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ message: 'Server error fetching reports' });
  }
});

// Get single report
router.get('/:id', async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('reporter', 'name phoneNumber')
      .populate('assignedDepartment', 'name contactEmail')
      .populate('assignedStaff', 'name email');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Increment view count
    report.viewCount += 1;
    await report.save();

    res.json({ report });

  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({ message: 'Server error fetching report' });
  }
});

// Update report status (admin/staff only)
router.put('/:id/status', verifyToken, [
  body('status').isIn(['submitted', 'verified', 'assigned', 'in_progress', 'resolved', 'closed']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, comment, assignedDepartment, assignedStaff } = req.body;
    
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const oldStatus = report.status;
    report.status = status;

    // Update timestamps based on status
    if (status === 'verified') {
      report.verifiedAt = new Date();
    } else if (status === 'assigned') {
      report.assignedAt = new Date();
      if (assignedDepartment) report.assignedDepartment = assignedDepartment;
      if (assignedStaff) report.assignedStaff = assignedStaff;
    } else if (status === 'resolved') {
      report.resolvedAt = new Date();
    }

    await report.save();

    // Emit socket event for status update
    const io = req.app.get('io');
    if (io) {
      io.emit('report:status', { id: report._id || report.id, status });
    }

    res.json({
      message: 'Report status updated successfully',
      report
    });

  } catch (error) {
    console.error('Update report error:', error);
    res.status(500).json({ message: 'Server error updating report' });
  }
});

// Upvote a report
router.post('/:id/upvote', verifyToken, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Increment upvotes
    report.upvotes += 1;
    
    // Increase priority if it gets enough upvotes
    if (report.upvotes >= 5 && report.priority < 5) {
      report.priority += 1;
    }

    await report.save();

    res.json({
      message: 'Report upvoted successfully',
      upvotes: report.upvotes,
      priority: report.priority
    });

  } catch (error) {
    console.error('Upvote error:', error);
    res.status(500).json({ message: 'Server error upvoting report' });
  }
});

// Search reports
router.get('/search/text', async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const reports = await Report.find(
      { $text: { $search: q } },
      { score: { $meta: 'textScore' } }
    )
      .populate('reporter', 'name phoneNumber')
      .populate('assignedDepartment', 'name')
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({ reports });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Server error searching reports' });
  }
});

module.exports = router;
