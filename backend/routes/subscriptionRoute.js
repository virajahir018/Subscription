const express = require("express");
const authentication = require("../middleware/authentication");
const Subscription = require("../models/Subscription");
const admin = require("../middleware/admin");

const subRouter = express.Router();

subRouter.post("/get", authentication, async (req, res) => {
    try {
        const { plan } = req.body

        const user = await Subscription.findOne({ user: req.user.id })

        if (user) {
            user.plan = plan
            await user.save();

            return res.json({
                message: "Plan update successfully",
                user
            })
        }

        if (!plan) {
            plan = "free"
        }

        const subscription = await Subscription.create({
            user: req.user.id,
            plan
        })

        res.json({
            message: "Plan created successfully",
            subscription
        })
    } catch (error) {
        res.json({
            message: error.message
        })
    }
})

subRouter.get("/all", authentication, admin, async (req, res) => {
    try {
        const all = await Subscription.find();

        res.json(all)
    } catch (error) {
        res.json({
            message: error.message
        })
    }
})

module.exports = subRouter
