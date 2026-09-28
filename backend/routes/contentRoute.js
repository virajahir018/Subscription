const express = require("express");
const mongoose = require("mongoose");
const authentication = require("../middleware/authentication");
const admin = require("../middleware/admin");
const Content = require("../models/Content");
const Subscription = require("../models/Subscription");

const contentRouter = express.Router();
const plans = ["free", "premium", "pro"];

contentRouter.post("/create", authentication, admin, async (req, res) => {
    try {
        const title = typeof req.body.title === "string" ? req.body.title.trim() : "";
        const description = typeof req.body.description === "string" ? req.body.description.trim() : "";
        const plan = req.body.plan || "free";

        if (!title || !description || !plans.includes(plan)) {
            return res.status(400).json({
                message: "Title, description and a valid plan are required"
            });
        }

        const content = await Content.create({ title, description, plan });

        return res.status(201).json({
            message: "Content create successfully",
            content
        });
    } catch (error) {
        console.error("Failed to create content:", error);
        return res.status(500).json({
            message: "Unable to create content"
        });
    }
});

contentRouter.put("/update", authentication, admin, async (req, res) => {
    try {
        const { id, title, plan } = req.body;

        if (!id && (typeof title !== "string" || !title.trim())) {
            return res.status(400).json({
                message: "Content id or title is required"
            });
        }

        if (!plans.includes(plan)) {
            return res.status(400).json({
                message: "A valid plan is required"
            });
        }

        if (id && !mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid content id"
            });
        }

        const content = await Content.findOne(id ? { _id: id } : { title: title.trim() });

        if (!content) {
            return res.status(404).json({
                message: "Content not found"
            });
        }

        content.plan = plan
        await content.save();

        return res.json({
            message: "Content update successfully",
            content
        })
    } catch (error) {
        console.error("Failed to update content:", error);
        return res.status(500).json({
            message: "Unable to update content"
        });
    }
});

contentRouter.delete("/delete/:id", authentication, admin, async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid content id"
            });
        }

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
        console.error("Failed to delete content:", error);
        return res.status(500).json({
            message: "Unable to delete content",
        })
    }
})

contentRouter.get("/view", authentication, async (req, res) => {
    try {
        const subscription = await Subscription.findOne({ user: req.user.id })

        let allowedPlans = [];

        if (req.user.role === "admin") {
            allowedPlans = plans;
        } else if (!subscription) {
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
        console.error("Failed to fetch content:", error);
        return res.status(500).json({
            message: "Unable to fetch content"
        });
    }
});

module.exports = contentRouter;