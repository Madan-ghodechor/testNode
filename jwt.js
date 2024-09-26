const jwt = require('jsonwebtoken');

function jwtAuthMiddleware(req, res, next) {
    const bearerHeader = req.headers.authorization;
    if (!bearerHeader) {
        return res.status(401).json({ error: 'Token Not Found' });
    }

    const token = bearerHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({ error: 'Invalid Token' });
    }
}

const generateToken = (userData) => {
    return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '60s' });
}

module.exports = { jwtAuthMiddleware, generateToken };
