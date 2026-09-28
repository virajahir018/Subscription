const jwt = require("jsonwebtoken");

function refresh(req, res, next) {
    try {
        const token = req.cookies?.refresh;

        if (!token) {
            return res.status(401).json({
                message: "Refresh token required"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT);

        if (decoded.type !== "refresh" || !decoded.id) {
            return res.status(401).json({
                message: "Invalid refresh token"
            });
        }

        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired refresh token"
        });
    }
}

module.exports = refresh;