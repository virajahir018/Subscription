require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const userRouters = require("./routes/userRoute");
const contentRouter = require("./routes/contentRoute");
const subRouter = require("./routes/subscriptionRoute");

const app = express();

app.use(express.json());

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
            console.log("Server running on port", process.env.PORT);
        });

    } catch (error) {
        console.log("Database connection failed");
        process.exit(1);
    }
}

startServer();