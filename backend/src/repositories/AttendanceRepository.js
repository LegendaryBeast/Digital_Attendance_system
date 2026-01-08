const Attendance = require('../models/Attendance');

/**
 * AttendanceRepository - Data access layer for Attendance model
 * Implements Repository Pattern (Dependency Inversion Principle)
 */
class AttendanceRepository {
    /**
     * Find attendance records by class ID
     * @param {string} classId 
     * @returns {Promise<Array<Attendance>>}
     */
    async findByClass(classId) {
        return await Attendance.find({ class: classId })
            .sort({ registrationNumber: 1 })
            .select('-__v');
    }

    /**
     * Find attendance records by student ID
     * @param {string} studentId 
     * @returns {Promise<Array<Attendance>>}
     */
    async findByStudent(studentId) {
        return await Attendance.find({ student: studentId })
            .populate('class', 'name type date')
            .sort({ timestamp: -1 })
            .select('-__v');
    }

    /**
     * Create attendance record
     * @param {Object} attendanceData 
     * @returns {Promise<Attendance>}
     */
    async create(attendanceData) {
        const attendance = new Attendance(attendanceData);
        return await attendance.save();
    }

    /**
     * Check if attendance already exists for student in class
     * @param {string} classId 
     * @param {string} studentId 
     * @returns {Promise<Attendance|null>}
     */
    async findExisting(classId, studentId) {
        return await Attendance.findOne({
            class: classId,
            student: studentId
        });
    }

    /**
     * Check for duplicate attendance
     * @param {string} classId 
     * @param {string} studentId 
     * @returns {Promise<boolean>}
     */
    async isDuplicate(classId, studentId) {
        const existing = await this.findExisting(classId, studentId);
        return !!existing;
    }

    /**
     * Delete all attendance records for a class
     * @param {string} classId 
     * @returns {Promise<Object>}
     */
    async deleteByClass(classId) {
        return await Attendance.deleteMany({ class: classId });
    }

    /**
     * Get attendance count for a class
     * @param {string} classId 
     * @returns {Promise<number>}
     */
    async countByClass(classId) {
        return await Attendance.countDocuments({ class: classId });
    }

    /**
     * Get attendance records for export (minimal fields)
     * @param {string} classId 
     * @returns {Promise<Array>}
     */
    async findForExport(classId) {
        return await Attendance.find({ class: classId })
            .select('registrationNumber studentName timestamp -_id');
    }
}

module.exports = AttendanceRepository;
