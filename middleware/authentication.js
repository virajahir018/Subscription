const jwt = require("jsonwebtoken");

async function authentication(req, res, next) {
    try {
        const access = req.headers.access?.split(" ")[1];
        const refresh = req.headers.refresh?.split(" ")[1];

        let token;

        if (access) {
            token = access;
        }

        if (refresh) {
            token = refresh;
        }

        if (!token) {
            return res.json("Token required")
        }

        const decoded = await jwt.verify(token, process.env.JWT);

        req.user = decoded;

        next()
    } catch (error) {
        res.json(
            {
                message: error.message
            }
        )
    }
}

module.exports = authentication;