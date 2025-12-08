const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    studentName: {
        type: String,
        required: true
    },
    registrationNumber: {
        type: String,
        required: true
    },
    studentLocation: {
        latitude: Number,
        longitude: Number
    },
    validationCodeUsed: {
        type: String,
        required: true
    },
    distance: {
        type: Number, // Distance in meters from teacher (for offline classes)
        default: null
    },
    imageUrl: {
        type: String, // Cloudinary URL of student's photo taken during attendance
        default: null
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Compound index to prevent duplicate attendance
attendanceSchema.index({ class: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
