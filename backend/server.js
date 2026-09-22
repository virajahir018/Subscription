require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const userRouters = require("./routes/userRoute");
const contentRouter = require("./routes/contentRoute");
const subRouter = require("./routes/subscriptionRoute");
const cookie = require("cookie-parser");

const app = express();
const PORT = process.env.PORT

app.use(express.json());
app.use(cookie());

app.use("/user", userRouters)
app.use("/content", contentRouter)
app.use("/subscription", subRouter)

app.get("/", (req, res) => {
    res.json({
        message: "App is running"
    });
});

async function startServer() {
    try {
        await connectDB();

        app.listen(process.env.PORT, () => {
            console.log("Server running on port", PORT);
        });

    } catch (error) {
        console.log("Database connection failed", error.message);
        process.exit(1);
    }
}

startServer();