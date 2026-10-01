const express = require("express");
const session = require("express-session");
const redis = require("redis");
const connectRedis = require("connect-redis");
const path = require("path");

const app = express();
const PORT = 3002;

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Read form data
app.use(express.urlencoded({ extended: true }));

// ==========================================
// REDIS CONNECTION
// ==========================================

const redisClient = redis.createClient(6379, "127.0.0.1");

redisClient.on("error", (err) => {
    console.log("Redis Error:", err);
});

redisClient.on("connect", () => {
    console.log("Connected to Redis");
});

// ==========================================
// REDIS SESSION STORE
// ==========================================

const RedisStore = connectRedis(session);

app.use(
    session({
        store: new RedisStore({
            client: redisClient
        }),
        secret: "my-redis-secret-key",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 30
        }
    })
);

// ==========================================
// HOME / LOGIN PAGE
// ==========================================

app.get("/", (req, res) => {

    if (req.session.user) {
        return res.redirect("/dashboard");
    }

    res.render("login", {
        error: null
    });
});

// ==========================================
// LOGIN
// ==========================================

app.post("/login", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    // Demo login
    if (username === "admin" && password === "123456") {

        req.session.user = username;

        return res.redirect("/dashboard");
    }

    res.render("login", {
        error: "Invalid username or password."
    });
});

// ==========================================
// AUTHENTICATION MIDDLEWARE
// ==========================================

function isAuthenticated(req, res, next) {

    if (req.session.user) {
        next();
    } else {
        res.redirect("/");
    }
}

// ==========================================
// PROTECTED ROUTE 1
// ==========================================

app.get("/dashboard", isAuthenticated, (req, res) => {

    res.render("dashboard", {
        username: req.session.user
    });
});

// ==========================================
// PROTECTED ROUTE 2
// ==========================================

app.get("/profile", isAuthenticated, (req, res) => {

    res.render("profile", {
        username: req.session.user
    });
});

// ==========================================
// LOGOUT
// ==========================================

app.get("/logout", (req, res) => {

    req.session.destroy((err) => {

        if (err) {
            console.log(err);
            return res.send("Unable to logout.");
        }

        res.redirect("/");
    });
});

// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {

    console.log(`Server running at http://localhost:${PORT}`);

});