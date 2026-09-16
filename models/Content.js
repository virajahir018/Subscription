const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        description: {
            type: String,
            required: true
        },
        plan: {
            type: String,
            enum: ["free", "premium", "pro"],
            default: "free"
        }
    },
    {
        timestamps: true
    }
)

const Content = mongoose.model("Content", contentSchema);

module.exports = Content;