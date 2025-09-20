// authMiddleware.js
const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) return res.status(401).send("Access Denied");

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verify JWT
        req.user = decoded;  // Set req.user
        next();
    } catch (err) {
        res.status(400).send("Invalid token");
    }
}

module.exports = { auth };
