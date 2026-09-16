const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const generateToken = require("../token/generateToken");
const authentication = require("../middleware/authentication");
const admin = require("../middleware/Admin");

const userRouters = express.Router();

userRouters.post("/register", async (req, res) => {
    try {
        const { password } = req.body

        const hash = await bcrypt.hash(password, 10)

        const user = await User.create({ ...req.body, password: hash });

        res.json({
            message: "User register successfully",
            user
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

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.json({
                message: "Invalid password",
            })
        }

        const access = await generateToken(
            {
                id: user._id,
                email: user.email,
                role: user.role
            }, "access"
        )
        const refresh = await generateToken(
            {
                id: user._id,
                email: user.email,
                role: user.role
            }, "refresh"
        )
        res.json({
            message: "User login successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            access,
            refresh
        });

    } catch (error) {
        res.json({
            message: error.message
        })
    }
})

userRouters.post("/logout", authentication,admin, async (req, res) => {
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