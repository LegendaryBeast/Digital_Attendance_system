const express = require('express');
const router = express.Router();
const Class = require('../models/Class');
const User = require('../models/User');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Create a new class (teacher only)
router.post('/create', authenticateToken, requireRole('teacher'), async (req, res) => {
    try {
        const { name, type, validationCode, location } = req.body;

        // Validate required fields
        if (!name || !type || !validationCode) {
            return res.status(400).json({ error: 'Name, type, and validation code are required' });
        }

        // Validate type
        if (!['online', 'offline'].includes(type)) {
            return res.status(400).json({ error: 'Type must be either "online" or "offline"' });
        }

        // Validate location for offline classes
        if (type === 'offline') {
            if (!location || !location.latitude || !location.longitude) {
                return res.status(400).json({
                    error: 'Location (latitude and longitude) is required for offline classes'
                });
            }
        }

        // Get teacher info
        const teacher = await User.findById(req.user.userId);
        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }

        // Create class
        const newClass = new Class({
            name,
            type,
            validationCode,
            teacher: req.user.userId,
            teacherName: teacher.name,
            teacherLocation: type === 'offline' ? {
                latitude: location.latitude,
                longitude: location.longitude
            } : undefined
        });

        await newClass.save();

        res.status(201).json({
            message: 'Class created successfully',
            class: newClass
        });
    } catch (error) {
        console.error('Create class error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get all active classes
router.get('/active', authenticateToken, async (req, res) => {
    try {
        const classes = await Class.find({ isActive: true })
            .sort({ createdAt: -1 })
            .select('-__v');

        res.json({ classes });
    } catch (error) {
        console.error('Get classes error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get class details by ID
router.get('/:classId', authenticateToken, async (req, res) => {
    try {
        const classData = await Class.findById(req.params.classId);

        if (!classData) {
            return res.status(404).json({ error: 'Class not found' });
        }

        res.json({ class: classData });
    } catch (error) {
        console.error('Get class error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update validation code (teacher only)
router.post('/generate-code/:classId', authenticateToken, requireRole('teacher'), async (req, res) => {
    try {
        const { validationCode } = req.body;

        if (!validationCode) {
            return res.status(400).json({ error: 'Validation code is required' });
        }

        const classData = await Class.findById(req.params.classId);

        if (!classData) {
            return res.status(404).json({ error: 'Class not found' });
        }

        // Check if the teacher owns this class
        if (classData.teacher.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'You can only update your own classes' });
        }

        classData.validationCode = validationCode;
        await classData.save();

        res.json({
            message: 'Validation code updated successfully',
            validationCode: classData.validationCode
        });
    } catch (error) {
        console.error('Update validation code error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Toggle class active status (teacher only)
router.patch('/:classId/toggle', authenticateToken, requireRole('teacher'), async (req, res) => {
    try {
        const classData = await Class.findById(req.params.classId);

        if (!classData) {
            return res.status(404).json({ error: 'Class not found' });
        }

        // Check if the teacher owns this class
        if (classData.teacher.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'You can only update your own classes' });
        }

        classData.isActive = !classData.isActive;
        await classData.save();

        res.json({
            message: `Class ${classData.isActive ? 'activated' : 'deactivated'} successfully`,
            class: classData
        });
    } catch (error) {
        console.error('Toggle class error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get teacher's classes
router.get('/teacher/my-classes', authenticateToken, requireRole('teacher'), async (req, res) => {
    try {
        const classes = await Class.find({ teacher: req.user.userId })
            .sort({ createdAt: -1 })
            .select('-__v');

        res.json({ classes });
    } catch (error) {
        console.error('Get teacher classes error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Delete class (teacher only)
router.delete('/:classId', authenticateToken, requireRole('teacher'), async (req, res) => {
    try {
        const classData = await Class.findById(req.params.classId);

        if (!classData) {
            return res.status(404).json({ error: 'Class not found' });
        }

        // Check if the teacher owns this class
        if (classData.teacher.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'You can only delete your own classes' });
        }

        // Delete associated attendance records
        const Attendance = require('../models/Attendance');
        await Attendance.deleteMany({ class: req.params.classId });

        // Delete the class
        await Class.findByIdAndDelete(req.params.classId);

        res.json({
            message: 'Class deleted successfully'
        });
    } catch (error) {
        console.error('Delete class error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
