const jwt = require("jsonwebtoken");

const JWT_SECRET = "employee-site-secret-key";

function verifyToken(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({
            message: "Access denied. Please login."
        });
    }

    try {
        const decoded = jwt.verify(
            token.replace("Bearer ", ""),
            JWT_SECRET
        );

        req.employee = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token."
        });
    }
}

module.exports = {
    verifyToken,
    JWT_SECRET
};