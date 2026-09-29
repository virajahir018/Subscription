const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto")

const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const authentication = require("../middleware/authentication");
const refresh = require("../middleware/refresh");
const admin = require("../middleware/admin");
const Transporter = require("../utils/sendEmail");

const userRouters = express.Router();
const isProduction = process.env.NODE_ENV === "production";

const accessCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    maxAge: 15 * 60 * 1000
};

const refreshCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
};

userRouters.post("/register", async (req, res) => {
    try {
        const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
        const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
        const password = typeof req.body.password === "string" ? req.body.password : "";

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
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

        return res.status(201).json({
            message: "User register successfully",
            user: {
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Registration failed:", error);
        return res.status(500).json({
            message: "Unable to register user"
        })
    }
})

userRouters.post("/login", async (req, res) => {
    try {
        const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
        const password = typeof req.body.password === "string" ? req.body.password : "";

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            })
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({
                message: "Invalid email or password",
            })
        }

        const tokens = generateToken({
            id: user._id,
            email: user.email,
            role: user.role
        });

        res.cookie("access", tokens.accessToken, accessCookieOptions);
        res.cookie("refresh", tokens.refreshToken, refreshCookieOptions);

        return res.json({
            message: "User login successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });

    } catch (error) {
        console.error("Login failed:", error);
        return res.status(500).json({
            message: "Unable to login"
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

userRouters.post("/refresh", refresh, async (req, res) => {

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

    res.cookie("access", accessToken, accessCookieOptions);

    return res.json({
        message: "Access token refreshed successfully"
    });
});

userRouters.post("/logout", async (req, res) => {
    try {
        res.clearCookie("access", accessCookieOptions);
        res.clearCookie("refresh", refreshCookieOptions);

        return res.json({
            message: "Logout successfully"
        });
    } catch (error) {
        console.error("Logout failed:", error);
        return res.status(500).json({
            message: "Unable to logout"
        });
    }
})

userRouters.get("/all", authentication, admin, async (req, res) => {
    try {
        const users = await User.find().select("-password");
        return res.json(users);
    } catch (error) {
        console.error("Failed to fetch users:", error);
        return res.status(500).json({
            message: "Unable to fetch users"
        });
    }
})

userRouters.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const otp = crypto.randomInt(100000, 1000000).toString();

        user.resetOtp = otp;
        user.resetOtpExpire = new Date(Date.now() + 5 * 60 * 1000);

        await user.save();

        const token = generateToken({
            id: user._id,
            email: user.email,
            role: user.role
        })

        const resetToken = token.accessToken

        console.log(resetToken)

        await Transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset OTP",
            text: `Your password reset OTP is ${otp}. This OTP is valid for 5 minutes.`
        })

        res.json({
            message: "OTP sent successfully",
            resetToken
        })

    } catch (error) {
        res.json({
            message: error.message
        })
    }
})

userRouters.post("/reset-password", async (req, res) => {
    try {
        const { otp } = req.body;

        if (!otp) {
            return res.status(400).json({
                message: "OTP required"
            });
        }



        res.json(otp);

    } catch (error) {
        res.status(400).json({
            message: "Invalid or expired token"
        });
    }
})

module.exports = userRouters;