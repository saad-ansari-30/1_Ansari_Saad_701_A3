const express = require("express");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const path = require("path");

const app = express();

const PORT = 3001;


// ======================================================
// EJS Configuration
// ======================================================

app.set("view engine", "ejs");

app.set(
    "views",
    path.join(__dirname, "views")
);


// ======================================================
// Middleware
// ======================================================

app.use(express.urlencoded({
    extended: true
}));


// ======================================================
// Session Configuration
// ======================================================

app.use(
    session({

        store: new FileStore({

            path: "./sessions",

            retries: 0

        }),

        secret: "my-secret-key",

        resave: false,

        saveUninitialized: false,

        cookie: {

            maxAge: 1000 * 60 * 30

        }

    })
);


// ======================================================
// Login Page
// ======================================================

app.get("/", (req, res) => {

    if (req.session.user) {

        return res.redirect("/dashboard");

    }

    res.render("login", {

        error: null

    });

});


// ======================================================
// Login POST
// ======================================================

app.post("/login", (req, res) => {

    const username = req.body.username;

    const password = req.body.password;


    // Demo username and password

    if (
        username === "admin" &&
        password === "123456"
    ) {

        req.session.user = username;

        return res.redirect("/dashboard");

    }


    res.render("login", {

        error: "Invalid username or password."

    });

});


// ======================================================
// Authentication Middleware
// ======================================================

function isAuthenticated(req, res, next) {

    if (req.session.user) {

        next();

    } else {

        res.redirect("/");

    }

}


// ======================================================
// Protected Route 1
// ======================================================

app.get(
    "/dashboard",
    isAuthenticated,
    (req, res) => {

        res.render("dashboard", {

            username: req.session.user

        });

    }
);


// ======================================================
// Protected Route 2
// ======================================================

app.get(
    "/profile",
    isAuthenticated,
    (req, res) => {

        res.render("profile", {

            username: req.session.user

        });

    }
);


// ======================================================
// Logout
// ======================================================

app.get("/logout", (req, res) => {

    req.session.destroy((err) => {

        if (err) {

            console.log(err);

            return res.send(
                "Unable to logout."
            );

        }

        res.redirect("/");

    });

});


// ======================================================
// Start Server
// ======================================================

app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});