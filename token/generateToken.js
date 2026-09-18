const jwt = require("jsonwebtoken");

function generateToken(obj) {

    const accessToken = jwt.sign({ ...obj, type: "access" }, process.env.JWT, { expiresIn: 900 })

    const refreshToken = jwt.sign({ ...obj, type: "refresh" }, process.env.JWT, { expiresIn: "7d" })

    console.log(refreshToken)
    return { accessToken, refreshToken };
}

module.exports = generateToken;