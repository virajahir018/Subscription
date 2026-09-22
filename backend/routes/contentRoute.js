const express = require("express");
const authentication = require("../middleware/authentication");
const admin = require("../middleware/admin");
const Content = require("../models/Content");
const Subscription = require("../models/Subscription");

const contentRouter = express.Router();

contentRouter.post("/create", authentication, admin, async (req, res) => {
    try {
        const content = await Content.create(req.body)

        return res.json({
            message: "Content create successfully",
            content
        })
    } catch (error) {
        return res.json({
            message: error.message
        })
    }
})

contentRouter.put("/update", authentication, admin, async (req, res) => {
    try {
        const { title, plan } = req.body;

        const content = await Content.findOne({ title })

        if (!content) {
            return res.json({
                message: "Content not found"
            })
        }

        content.plan = plan
        await content.save();

        return res.json({
            message: "Content update successfully",
            content
        })
    } catch (error) {
        return res.json({
            message: error.message
        })
    }
})

contentRouter.delete("/delete/:id", authentication, admin, async (req, res) => {
    try {
        const content = await Content.findByIdAndDelete(req.params.id)

        if (!content) {
            return res.status(404).json({
                message: "Content not found"
            });
        }

        return res.json({
            message: "Content delete successfully",
            content
        })
    } catch (error) {
        return res.json({
            message: error.message,
        })
    }
})

contentRouter.get("/view", authentication, async (req, res) => {
    try {
        const subscription = await Subscription.findOne({ user: req.user.id })

        let allowedPlans = [];

        if (!subscription) {
            allowedPlans = ["free"];
        } else if (subscription.plan === "free") {
            allowedPlans = ["free"];
        } else if (subscription.plan === "premium") {
            allowedPlans = ["free", "premium"];
        } else if (subscription.plan === "pro" || req.user.role === "admin") {
            allowedPlans = ["free", "premium", "pro"];
        }

        const content = await Content.find({
            plan: { $in: allowedPlans }
        });

        return res.json({
            message: "Content fetched successfully",
            content
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});

module.exports = contentRouter;