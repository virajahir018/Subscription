require("dotenv").config();

const express = require("express");
const cors = require("cors")
const cookie = require("cookie-parser");
const session = require("express-session");

const connectDB = require("./config/db");
const userRouters = require("./routes/userRoute");
const contentRouter = require("./routes/contentRoute");
const subRouter = require("./routes/subscriptionRoute");


if (!process.env.JWT || !process.env.MONGO_URI) {
    throw new Error("JWT and MONGO_URI environment variables are required");
}

const app = express();
const PORT = Number(process.env.PORT);

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json({ limit: "1mb" }));


app.use(session({
    secret: process.env.JWT,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 5 * 60 * 1000
    }
    
}));

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