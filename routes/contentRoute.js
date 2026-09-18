const express = require("express");
const authentication = require("../middleware/authentication");
const admin = require("../middleware/admin");
const Content = require("../models/Content");
const Subscription = require("../models/Subscription");

const contentRouter = express.Router();

contentRouter.post("/create", authentication, admin, async (req, res) => {
    try {
        const content = await Content.create(req.body)

        res.json({
            message: "Content create successfully",
            content
        })
    } catch (error) {
        res.json({
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

        res.json({
            message: "Content update successfully",
            content
        })
    } catch (error) {
        res.json({
            message: error.message
        })
    }
})

contentRouter.delete("/delete/:id", authentication, admin, async (req, res) => {
    try {
        const content = await Content.findByIdAndDelete(req.params.id)

        res.json({
            message: "Content delete successfully",
            content
        })
    } catch (error) {
        res.json({
            message: error.message,
        })
    }
})

contentRouter.get("/view", authentication, async (req, res) => {
    try {
        const user = await Subscription.findOne({ user: req.user.id })

        let alwPlan = [];

        if (user.plan === "free") {
            alwPlan = ["free"];
        }

        if (user.plan === "premium") {
            alwPlan = ["free", "premium"];
        }

        if (user.plan === "pro" || req.user.role == "admin") {
            alwPlan = ["free", "premium", "pro"];
        }

        const content = await Content.find({
            plan: { $in: alwPlan }
        });

        res.json({
            message: "Content fetched successfully",
            content
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = contentRouter;