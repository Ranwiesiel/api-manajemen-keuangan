const { verifyToken } = require('../utils/jwt.utils');

/**
 * Middleware to authenticate JWT token
 * Checks if the token is valid and not expired
 */
function authenticate(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(403).json({ message: 'Invalid token' });
    }

    req.user = decoded;
    next();
}

module.exports = {
    authenticate
};