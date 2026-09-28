const express = require("express");
const authentication = require("../middleware/authentication");
const admin = require("../middleware/admin");
const Subscription = require("../models/Subscription");

const subRouter = express.Router();
const plans = ["free", "premium", "pro"];

subRouter.get("/", authentication, async (req, res) => {
    try {
        const subscription = await Subscription.findOne({ user: req.user.id });

        return res.json({
            subscription: subscription || null
        });
    } catch (error) {
        console.error("Failed to fetch subscription:", error);

        return res.json({
            message: "Unable to fetch subscription"
        });
    }
});

subRouter.post("/add", authentication, async (req, res) => {
    try {
        const { plan = "free" } = req.body;

        if (!plans.includes(plan)) {
            return res.json({
                message: "Invalid plan"
            });
        }

        const subscription = await Subscription.findOneAndUpdate(
            { user: req.user.id },
            { $set: { plan } },
            {
                new: true,
                upsert: false,
                runValidators: true,
            }
        );

        return res.json({
            message: "Plan saved successfully",
            subscription
        });
    } catch (error) {
        console.error("Failed to save subscription:", error);

        return res.json({
            message: "Unable to save subscription"
        });
    }
});

subRouter.get("/all", authentication, admin, async (req, res) => {
    try {
        const all = await Subscription.find().populate("user", "name email role");

        return res.json(all);
    } catch (error) {
        console.error("Failed to fetch subscriptions:", error);

        return res.json({
            message: "Unable to fetch subscriptions"
        });
    }
});

module.exports = subRouter;
