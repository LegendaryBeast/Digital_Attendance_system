const jwt = require('jsonwebtoken');

/**
 * Middleware to verify JWT token and attach user info to request
 */
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }

        req.user = decoded;
        next();
    });
}

/**
 * Middleware to check if user has required role
 */
function requireRole(role) {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({ error: `Access denied. ${role} role required.` });
        }
        next();
    };
}

module.exports = {
    authenticateToken,
    requireRole
};
