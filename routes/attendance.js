const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Class = require('../models/Class');
const User = require('../models/User');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { isWithinRange } = require('../utils/geolocation');
const { exportToExcel } = require('../utils/excelExport');

// Submit attendance (student only)
router.post('/submit', authenticateToken, requireRole('student'), async (req, res) => {
    try {
        const { classId, validationCode, location } = req.body;

        // Validate required fields
        if (!classId || !validationCode) {
            return res.status(400).json({ error: 'Class ID and validation code are required' });
        }

        // Get class details
        const classData = await Class.findById(classId);
        if (!classData) {
            return res.status(404).json({ error: 'Class not found' });
        }

        // Check if class is active
        if (!classData.isActive) {
            return res.status(400).json({ error: 'This class is no longer active' });
        }

        // Verify validation code
        if (classData.validationCode !== validationCode) {
            return res.status(400).json({ error: 'Invalid validation code' });
        }

        // Get student info
        const student = await User.findById(req.user.userId);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Check for duplicate attendance
        const existingAttendance = await Attendance.findOne({
            class: classId,
            student: req.user.userId
        });

        if (existingAttendance) {
            return res.status(400).json({ error: 'You have already submitted attendance for this class' });
        }

        // For offline classes, verify location
        let distance = null;
        if (classData.type === 'offline') {
            if (!location || !location.latitude || !location.longitude) {
                return res.status(400).json({
                    error: 'Location is required for offline class attendance'
                });
            }

            const locationCheck = isWithinRange(
                classData.teacherLocation,
                location,
                50 // 50 meters
            );

            if (!locationCheck.isWithinRange) {
                return res.status(400).json({
                    error: `You are too far from the class location. Distance: ${locationCheck.distance}m (max: 50m)`,
                    distance: locationCheck.distance
                });
            }

            distance = locationCheck.distance;
        }

        // Create attendance record
        const attendance = new Attendance({
            class: classId,
            student: req.user.userId,
            studentName: student.name,
            registrationNumber: student.registrationNumber,
            studentLocation: location ? {
                latitude: location.latitude,
                longitude: location.longitude
            } : undefined,
            validationCodeUsed: validationCode,
            distance
        });

        await attendance.save();

        res.status(201).json({
            message: 'Attendance submitted successfully',
            attendance: {
                className: classData.name,
                timestamp: attendance.timestamp,
                distance: distance ? `${distance}m` : 'N/A (online class)'
            }
        });
    } catch (error) {
        console.error('Submit attendance error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get attendance for a specific class (teacher only)
router.get('/class/:classId', authenticateToken, requireRole('teacher'), async (req, res) => {
    try {
        const classData = await Class.findById(req.params.classId);

        if (!classData) {
            return res.status(404).json({ error: 'Class not found' });
        }

        // Check if the teacher owns this class
        if (classData.teacher.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'You can only view attendance for your own classes' });
        }

        const attendanceRecords = await Attendance.find({ class: req.params.classId })
            .sort({ registrationNumber: 1 })
            .select('-__v');

        res.json({
            class: {
                name: classData.name,
                type: classData.type,
                date: classData.date
            },
            totalStudents: attendanceRecords.length,
            attendance: attendanceRecords
        });
    } catch (error) {
        console.error('Get attendance error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Export attendance to Excel (teacher only)
router.get('/export/:classId', authenticateToken, requireRole('teacher'), async (req, res) => {
    try {
        const classData = await Class.findById(req.params.classId);

        if (!classData) {
            return res.status(404).json({ error: 'Class not found' });
        }

        // Check if the teacher owns this class
        if (classData.teacher.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'You can only export attendance for your own classes' });
        }

        const attendanceRecords = await Attendance.find({ class: req.params.classId })
            .select('registrationNumber studentName timestamp -_id');

        if (attendanceRecords.length === 0) {
            return res.status(400).json({ error: 'No attendance records found for this class' });
        }

        // Generate Excel file
        const excelBuffer = await exportToExcel(attendanceRecords, classData.name);

        // Create filename with class name and date
        const date = new Date().toISOString().split('T')[0];
        const safeClassName = classData.name.replace(/[^a-zA-Z0-9]/g, '_');
        const filename = `Attendance_${safeClassName}_${date}.xlsx`;

        // Send file as download
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(excelBuffer);
    } catch (error) {
        console.error('Export attendance error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get student's own attendance history
router.get('/my-attendance', authenticateToken, requireRole('student'), async (req, res) => {
    try {
        const attendanceRecords = await Attendance.find({ student: req.user.userId })
            .populate('class', 'name type date')
            .sort({ timestamp: -1 })
            .select('-__v');

        res.json({
            totalClasses: attendanceRecords.length,
            attendance: attendanceRecords
        });
    } catch (error) {
        console.error('Get student attendance error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
