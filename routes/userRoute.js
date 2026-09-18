const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const generateToken = require("../token/generateToken");
const authentication = require("../middleware/authentication");
const refresh = require("../middleware/refresh");
const jwt = require("jsonwebtoken");

const userRouters = express.Router();

userRouters.post("/register", async (req, res) => {
    try {
        const { password } = req.body

        const hash = await bcrypt.hash(password, 10)

        const user = await User.create({ ...req.body, password: hash });

        res.json({
            message: "User register successfully",
            user: {
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.json({
            message: error.message
        })
    }
})

userRouters.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email });

        if (!user) {
            return res.json({
                message: "Email not register"
            })
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.json({
                message: "Invalid password",
            })
        }

        const tokens = generateToken({
            id: user._id,
            email: user.email,
            role: user.role
        });

        res.json({
            message: "User login successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            access: tokens.accessToken,
            refresh: tokens.refreshToken
        });

    } catch (error) {
        res.json({
            message: error.message
        })
    }
})

userRouters.get("/profile", authentication, async (req, res) => {

    res.json({
        message: "Profile accessed",
        userId: req.user.id
    });
}
);

userRouters.post("/refresh", refresh, async (req, res) => {

    const accessToken = jwt.sign(
        {
            id: req.user.id,
            type: "access"
        },
        process.env.JWT,
        {
            expiresIn: "15m"
        }
    );

    res.json({
        message: "Access token refreshed successfully",
        accessToken
    });
}
);

userRouters.post("/logout", authentication, async (req, res) => {
    try {
        res.json({
            message: "Logout successfully",
            user: {
                id: req.user.id,
                email: req.user.email
            }
        })
    } catch (error) {
        res.json({
            message: error.message
        })
    }
})

module.exports = userRouters;