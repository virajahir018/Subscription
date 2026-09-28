require("dotenv").config();

const express = require("express");
const cors = require("cors")

const connectDB = require("./config/db");
const userRouters = require("./routes/userRoute");
const contentRouter = require("./routes/contentRoute");
const subRouter = require("./routes/subscriptionRoute");
const cookie = require("cookie-parser");

if (!process.env.JWT || !process.env.MONGO_URI) {
    throw new Error("JWT and MONGO_URI environment variables are required");
}

const app = express();
const PORT = Number(process.env.PORT);

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(cookie());

app.use("/user", userRouters)
app.use("/content", contentRouter)
app.use("/subscription", subRouter)

app.get("/", (req, res) => {
    res.json({
        message: "App is running"
    });
});

app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

async function startServer() {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log("Server running on port", PORT);
        });

    } catch (error) {
        console.error("Database connection failed", error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    startServer();
}

module.exports = app;