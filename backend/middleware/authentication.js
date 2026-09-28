const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
    try {
        const token = req.cookies?.access;

        if (!token) {
            return res.status(401).json({
                message: "Access token required"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT);

        if (decoded.type !== "access" || !decoded.id) {
            return res.status(401).json({
                message: "Invalid access token"
            });
        }

        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired access token"
        });
    }
}

module.exports = authMiddleware;