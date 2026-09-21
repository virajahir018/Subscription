const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {

    try {

        const token = req.cookies?.access

        if (!token) {
            return res.json({
                message: "Access token required"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT);

        if (decoded.type !== "access") {
            return res.json({
                message: "Invalid access token"
            });
        }

        req.user = decoded;

        next();

    } catch (error) {

        return res.json({
            message: "Invalid or expired access token"
        });
    }
}

module.exports = authMiddleware;