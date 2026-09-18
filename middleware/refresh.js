const jwt = require("jsonwebtoken");

function refresh(req, res, next) {

    try {

        const token = req.headers.refresh?.split(" ")[1];

        if (!token) {
            return res.json({
                message: "Refresh token required"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT);

        if (decoded.type !== "refresh") {
            return res.json({
                message: "Invalid refresh token"
            });
        }

        req.user = decoded;

        next();

    } catch (error) {

        return res.json({
            message: "Invalid or expired refresh token"
        });
    }
}

module.exports = refresh;