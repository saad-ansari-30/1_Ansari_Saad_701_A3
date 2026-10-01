const express = require("express");
const cors = require("cors");
require("dotenv").config();

const sequelize = require("./config/database");

const studentRoutes = require("./routes/studentRoutes");

const app = express();

const PORT = process.env.PORT || 5000;


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));


// ==========================================
// HOME
// ==========================================

app.get("/", (req, res) => {

    res.json({
        message: "Q8 Student CRUD Backend Running"
    });

});


// ==========================================
// STUDENT ROUTES
// ==========================================

app.use(
    "/api/students",
    studentRoutes
);


// ==========================================
// DATABASE CONNECTION
// ==========================================

sequelize
    .authenticate()
    .then(() => {

        console.log(
            "MySQL connected successfully"
        );

        return sequelize.sync();

    })
    .then(() => {

        console.log(
            "Student table ready"
        );

        app.listen(PORT, () => {

            console.log(
                `Backend running at http://localhost:${PORT}`
            );

        });

    })
    .catch((error) => {

        console.log(
            "Database connection error:",
            error.message
        );

    });