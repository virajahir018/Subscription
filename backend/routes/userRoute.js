const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateToken = require("../token/generateToken");
const authentication = require("../middleware/authentication");
const refresh = require("../middleware/refresh");
const admin = require("../middleware/admin");

const userRouters = express.Router();

userRouters.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({
                message: "Name, email and password are required"
            });
        }

        if (password.length < 6) {
            return res.json({
                message: "Password must be at least 6 characters"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.json({
                message: "Email already registered"
            });
        }

        const hash = await bcrypt.hash(password, 10)

        const user = await User.create({
            name,
            email,
            password: hash,
            role: "user"
        });

        return res.json({
            message: "User register successfully",
            user: {
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        return res.json({
            message: error.message
        })
    }
})

userRouters.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.json({
                message: "Email and password are required"
            });
        }

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

        res.cookie("access", tokens.accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 15 * 60 * 1000
        })

        res.cookie("refresh", tokens.refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.json({
            message: "User login successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });

    } catch (error) {
        return res.json({
            message: error.message
        })
    }
})

userRouters.get("/profile", authentication, async (req, res) => {

    return res.json({
        message: "Profile accessed",
        user: {
            id: req.user.id,
            email: req.user.email,
            role: req.user.role
        }
    });
}
);

userRouters.post("/refresh", authentication, refresh, async (req, res) => {

    const accessToken = jwt.sign(
        {
            id: req.user.id,
            email: req.user.email,
            role: req.user.role,
            type: "access"
        },
        process.env.JWT,
        { expiresIn: "15m" }
    );

    res.cookie("access", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 15 * 60 * 1000
    })

    return res.json({
        message: "Access token refreshed successfully",
        accessToken
    });
});

userRouters.post("/logout", authentication, async (req, res) => {
    try {
        res.clearCookie("access");
        res.clearCookie("refresh");

        return res.json({
            message: "Logout successfully"
        });
    } catch (error) {
        return res.json({
            message: error.message
        });
    }
})

userRouters.get("/all", authentication, admin, async (req, res) => {
    const users = await User.find();

    res.json(users)
})

module.exports = userRouters;