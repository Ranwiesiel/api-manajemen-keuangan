const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET;

const tokenCache = new Map();

// Generate JWT 
const generateToken = (payload) => {
    // Create a unique user identifier from the payload
    const userKey = `${payload.id}`;
    
    // Check if user has a valid token already
    const cachedToken = tokenCache.get(userKey);
    
    if (cachedToken) {
        try {
            // Verify if the token is still valid
            const decoded = jwt.verify(cachedToken, secretKey);
            if (decoded) {
                return cachedToken;
            }
        } catch (error) {}
    }
    
    // Generate new token
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
    // Store in cache
    tokenCache.set(userKey, token);
    
    return token;
};

// Verify JWT token
const verifyToken = (token) => {
    try {
        return jwt.verify(token, secretKey);
    } catch (error) {
        return null;
    }
};

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
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
};


module.exports = {
    generateToken,
    authenticateToken,
    verifyToken
};