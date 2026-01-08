const jwt = require('jsonwebtoken');
const Environment = require('../config/environment');

/**
 * AuthService - Business logic for authentication
 * Depends on UserRepository (Dependency Injection)
 * Single Responsibility: Authentication operations
 */
class AuthService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Register a new user
     * @param {Object} userData - { email, password, name, role }
     * @returns {Promise<Object>} { token, user }
     */
    async register(userData) {
        const { email, password, name, role } = userData;

        // Validate required fields
        this.validateRequiredFields({ email, password, name, role });

        // Check if user already exists
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('Email already registered');
        }

        // Extract and validate registration number for students
        let registrationNumber = null;
        if (role === 'student') {
            registrationNumber = this.extractRegistrationNumber(email);
        }

        // Create user data object
        const newUserData = {
            email,
            password,
            name,
            role
        };

        // Add registration number if student
        if (registrationNumber) {
            newUserData.registrationNumber = registrationNumber;
        }

        // Create user
        const user = await this.userRepository.create(newUserData);

        // Generate token
        const token = this.generateToken(user);

        return {
            token,
            user: this.sanitizeUser(user)
        };
    }

    /**
     * Login user
     * @param {Object} credentials - { email, password }
     * @returns {Promise<Object>} { token, user }
     */
    async login(credentials) {
        const { email, password } = credentials;

        // Validate required fields
        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        // Find user
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Invalid email or password');
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        // Generate token
        const token = this.generateToken(user);

        return {
            token,
            user: this.sanitizeUser(user)
        };
    }

    /**
     * Generate JWT token
     * @param {Object} user 
     * @returns {string}
     */
    generateToken(user) {
        return jwt.sign(
            { userId: user._id, role: user.role },
            Environment.JWT_SECRET,
            { expiresIn: '7d' }
        );
    }

    /**
     * Validate required fields
     * @param {Object} fields 
     */
    validateRequiredFields(fields) {
        const { email, password, name, role } = fields;
        if (!email || !password || !name || !role) {
            throw new Error('All fields are required');
        }
    }

    /**
     * Extract registration number from student email
     * @param {string} email 
     * @returns {string}
     */
    extractRegistrationNumber(email) {
        const match = email.match(/^([0-9]{10})@student\.sust\.edu$/);
        if (!match) {
            throw new Error(
                'Invalid student email format. Must be: XXXXXXXXXX@student.sust.edu'
            );
        }
        return match[1];
    }

    /**
     * Remove sensitive data from user object
     * @param {Object} user 
     * @returns {Object}
     */
    sanitizeUser(user) {
        return {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            registrationNumber: user.registrationNumber
        };
    }
}

module.exports = AuthService;
