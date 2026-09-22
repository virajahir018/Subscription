const express = require("express");
const authentication = require("../middleware/authentication");
const admin = require("../middleware/admin");
const Subscription = require("../models/Subscription");

const subRouter = express.Router();

subRouter.post("/get", authentication, async (req, res) => {
    try {
        const { plan = "free" } = req.body;

        if (!["free", "premium", "pro"].includes(plan)) {
            return res.json({
                message: "Invalid plan"
            });
        }

        let subscription = await Subscription.findOne({ user: req.user.id });

        if (subscription) {
            subscription.plan = plan;
            await subscription.save();

            return res.json({
                message: "Plan updated successfully",
                subscription
            });
        }

        subscription = await Subscription.create({
            user: req.user.id,
            plan
        });

        return res.json({
            message: "Plan created successfully",
            subscription
        })
    } catch (error) {
        return res.json({
            message: error.message
        })
    }
})

subRouter.get("/all", authentication, admin, async (req, res) => {
    try {
        const all = await Subscription.find().populate("user", "name email role");;

        return res.json(all)
    } catch (error) {
        return res.json({
            message: error.message
        })
    }
})

module.exports = subRouter
