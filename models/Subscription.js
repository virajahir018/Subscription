const mongoose = require("mongoose");

const subscriSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        plan: {
            type: String,
            enum: ["free", "premium", "pro"],
            default: "free"
        }
    }
);

const Subscription = mongoose.model("Subscription", subscriSchema);

module.exports = Subscription;