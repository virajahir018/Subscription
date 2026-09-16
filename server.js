require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const userRouters = require("./routes/userRoute");
const contentRouter = require("./routes/contentRoute");

const app = express();

app.use(express.json());

app.use("/user", userRouters)
app.use("/content", contentRouter)

connectDB();

app.get("", (req, res) => {
    res.json("App is running");
});

app.listen(process.env.PORT, () => {
    console.log("Server running on port", process.env.PORT)
})