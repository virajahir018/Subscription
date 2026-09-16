const mongoose = require("mongoose");

async function connectDB() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/app")
        console.log("Connected");
    } catch (error) {
        console.log("Not connected");
    }
}

module.exports = connectDB;