const jwt = require("jsonwebtoken");

function generateToken(obj, type) {
    let token;

    if (type == "access") {
        token = jwt.sign({ ...obj }, process.env.JWT, { expiresIn: 900 })
    }

    if (type == "refresh") {
        token = jwt.sign({ ...obj }, process.env.JWT, { expiresIn: "7d" })
    }

    return token;
}

module.exports = generateToken;