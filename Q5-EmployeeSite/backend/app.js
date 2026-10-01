const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Employee = require("./models/Employee");
const Leave = require("./models/Leave");
const { verifyToken, JWT_SECRET } = require("./middleware/auth");

const app = express();

const PORT = 3004;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ==========================================
// MongoDB Connection
// ==========================================

mongoose
    .connect("mongodb://127.0.0.1:27017/AdminERP")
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.log("MongoDB Connection Error:", error.message);
    });


// ==========================================
// Home
// ==========================================

app.get("/", (req, res) => {
    res.json({
        message: "Employee Site Backend Running"
    });
});


// ==========================================
// LOGIN
// ==========================================

app.post("/api/login", async (req, res) => {

    try {

        const { empId, password } = req.body;

        if (!empId || !password) {
            return res.status(400).json({
                message: "Employee ID and password are required."
            });
        }

        const employee = await Employee.findOne({ empId });

        if (!employee) {
            return res.status(401).json({
                message: "Invalid Employee ID or Password."
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            employee.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid Employee ID or Password."
            });
        }

        const token = jwt.sign(
            {
                id: employee._id,
                empId: employee.empId
            },
            JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        res.json({
            message: "Login successful",
            token: token,
            employee: {
                empId: employee.empId,
                name: employee.name
            }
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// ==========================================
// EMPLOYEE PROFILE
// ==========================================

app.get("/api/profile", verifyToken, async (req, res) => {

    try {

        const employee = await Employee.findOne({
            empId: req.employee.empId
        }).select("-password");

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found."
            });
        }

        res.json(employee);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// ==========================================
// ADD LEAVE
// ==========================================

app.post("/api/leaves", verifyToken, async (req, res) => {

    try {

        const { date, reason, grant } = req.body;

        if (!date || !reason || !grant) {
            return res.status(400).json({
                message: "Date, reason and grant are required."
            });
        }

        const leave = new Leave({
            empId: req.employee.empId,
            date: date,
            reason: reason,
            grant: grant
        });

        await leave.save();

        res.status(201).json({
            message: "Leave application added successfully.",
            leave: leave
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// ==========================================
// LIST LEAVES
// ==========================================

app.get("/api/leaves", verifyToken, async (req, res) => {

    try {

        const leaves = await Leave.find({
            empId: req.employee.empId
        }).sort({
            date: -1
        });

        res.json(leaves);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// ==========================================
// LOGOUT
// ==========================================

app.post("/api/logout", verifyToken, (req, res) => {

    res.json({
        message: "Logout successful"
    });
});


// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {

    console.log(
        `Employee Site Backend running at http://localhost:${PORT}`
    );

});