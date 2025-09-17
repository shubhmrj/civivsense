const express = require('express');
const Department = require('../models/Department');
const router = express.Router();

// Get all departments
router.get('/', async (req, res) => {
  try {
    const departments = await Department.find({ isActive: true })
      .sort({ name: 1 });

    res.json({ departments });

  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({ message: 'Server error fetching departments' });
  }
});

// Create new department
router.post('/', async (req, res) => {
  try {
    const department = new Department(req.body);
    await department.save();

    res.status(201).json({
      message: 'Department created successfully',
      department
    });

  } catch (error) {
    console.error('Create department error:', error);
    res.status(500).json({ message: 'Server error creating department' });
  }
});

module.exports = router;
