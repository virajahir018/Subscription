const mongoose = require("mongoose");

async function connectDB() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/app");

        console.log("MongoDB Connected");
    } catch (error) {
        console.log("MongoDB Connection Error:", error.message);
        throw error;
    }
}

module.exports = connectDB;