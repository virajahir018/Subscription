const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
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
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);

module.exports = Subscription;