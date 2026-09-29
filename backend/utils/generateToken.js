const jwt = require("jsonwebtoken");

function generateToken(obj) {

    const accessToken = jwt.sign(
        { ...obj, type: "access" },
        process.env.JWT,
        { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
        { ...obj, type: "refresh" },
        process.env.JWT,
        { expiresIn: "7d" }
    );

    return { accessToken, refreshToken };
}

module.exports = generateToken;