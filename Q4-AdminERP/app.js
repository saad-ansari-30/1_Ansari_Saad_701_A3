const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");
const bcrypt = require("bcryptjs");

const app = express();

const PORT = 3003;

const Employee = require("./models/Employee");

// ======================================================
// MONGODB CONNECTION
// ======================================================

mongoose
    .connect("mongodb://127.0.0.1:27017/AdminERP")
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.log(
            "MongoDB Connection Error:",
            error.message
        );
    });

// ======================================================
// EJS CONFIGURATION
// ======================================================

app.set("view engine", "ejs");

app.set(
    "views",
    path.join(__dirname, "views")
);

// ======================================================
// MIDDLEWARE
// ======================================================

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(express.json());

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);

// ======================================================
// SESSION
// ======================================================

app.use(
    session({
        secret: "admin-erp-secret-key",
        resave: false,
        saveUninitialized: false,

        cookie: {
            maxAge: 1000 * 60 * 30
        }
    })
);

// ======================================================
// LOGIN PAGE
// ======================================================

app.get("/", (req, res) => {

    if (req.session.admin) {
        return res.redirect("/dashboard");
    }

    res.render("login", {
        error: null
    });
});

// ======================================================
// LOGIN PAGE - /login
// ======================================================

app.get("/login", (req, res) => {

    if (req.session.admin) {
        return res.redirect("/dashboard");
    }

    res.render("login", {
        error: null
    });
});

// ======================================================
// ADMIN LOGIN
// ======================================================

app.post("/login", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    // Default admin credentials

    if (
        username === "admin" &&
        password === "admin123"
    ) {

        req.session.admin = username;

        return res.redirect("/dashboard");
    }

    res.render("login", {
        error: "Invalid username or password"
    });
});

// ======================================================
// ADMIN AUTHENTICATION MIDDLEWARE
// ======================================================

function isAdmin(req, res, next) {

    if (req.session.admin) {

        next();

    } else {

        res.redirect("/login");
    }
}

// ======================================================
// DASHBOARD
// ======================================================

app.get(
    "/dashboard",
    isAdmin,
    async (req, res) => {

        try {

            const employees =
                await Employee.find();

            res.render("dashboard", {
                admin: req.session.admin,
                employees: employees
            });

        } catch (error) {

            console.log(
                "Dashboard Error:",
                error.message
            );

            res.status(500).send(
                "Error loading dashboard"
            );
        }
    }
);

// ======================================================
// EMPLOYEE LIST
// ======================================================

app.get(
    "/employees",
    isAdmin,
    async (req, res) => {

        try {

            const employees =
                await Employee.find();

            res.render("employees", {
                employees: employees,
                success: false,
                newEmployee: null
            });

        } catch (error) {

            console.log(
                "Employee List Error:",
                error.message
            );

            res.status(500).send(
                "Error loading employees"
            );
        }
    }
);

// ======================================================
// ADD EMPLOYEE PAGE
// ======================================================

app.get(
    "/employees/add",
    isAdmin,
    (req, res) => {

        res.render("add-employee");
    }
);

// ======================================================
// ADD EMPLOYEE
// ======================================================

app.post(
    "/employees/add",
    isAdmin,
    async (req, res) => {

        try {

            // ------------------------------------------
            // GET FORM DATA
            // ------------------------------------------

            const name =
                req.body.name;

            const email =
                req.body.email;

            const department =
                req.body.department;

            const designation =
                req.body.designation;

            const basicSalary =
                Number(req.body.basicSalary);

            const joiningDate =
                req.body.joiningDate;


            // ------------------------------------------
            // VALIDATION
            // ------------------------------------------

            if (
                !name ||
                !email ||
                !department ||
                !designation ||
                !basicSalary ||
                !joiningDate
            ) {

                return res.send(
                    "Please fill all employee details."
                );
            }

            if (basicSalary <= 0) {

                return res.send(
                    "Basic salary must be greater than 0."
                );
            }


            // ------------------------------------------
            // GENERATE EMPLOYEE ID
            // ------------------------------------------

            const lastEmployee =
                await Employee
                    .findOne()
                    .sort({
                        createdAt: -1
                    });

            let nextNumber = 1;

            if (
                lastEmployee &&
                lastEmployee.empId
            ) {

                const lastNumber =
                    parseInt(
                        lastEmployee.empId
                            .replace("EMP", "")
                    );

                if (
                    !isNaN(lastNumber)
                ) {

                    nextNumber =
                        lastNumber + 1;
                }
            }

            const empId =
                "EMP" +
                String(nextNumber)
                    .padStart(3, "0");


            // ------------------------------------------
            // GENERATE RANDOM PASSWORD
            // ------------------------------------------

            const generatedPassword =
                Math.random()
                    .toString(36)
                    .slice(-8);


            // ------------------------------------------
            // ENCRYPT PASSWORD
            // ------------------------------------------

            const encryptedPassword =
                await bcrypt.hash(
                    generatedPassword,
                    10
                );


            // ------------------------------------------
            // SALARY CALCULATION
            // ------------------------------------------

            // HRA = 20% of Basic Salary

            const hra =
                basicSalary * 0.20;

            // DA = 10% of Basic Salary

            const da =
                basicSalary * 0.10;

            // Gross Salary

            const grossSalary =
                basicSalary +
                hra +
                da;


            // ------------------------------------------
            // CREATE EMPLOYEE
            // ------------------------------------------

            const employee =
                new Employee({

                    empId: empId,

                    name: name,

                    email: email,

                    department: department,

                    designation: designation,

                    basicSalary: basicSalary,

                    hra: hra,

                    da: da,

                    grossSalary: grossSalary,

                    password: encryptedPassword,

                    joiningDate: joiningDate
                });


            // ------------------------------------------
            // SAVE EMPLOYEE
            // ------------------------------------------

            await employee.save();


            // ------------------------------------------
            // DISPLAY INFORMATION IN TERMINAL
            // ------------------------------------------

            console.log(
                "================================"
            );

            console.log(
                "Employee added successfully"
            );

            console.log(
                "Employee ID:",
                empId
            );

            console.log(
                "Generated Password:",
                generatedPassword
            );

            console.log(
                "Name:",
                name
            );

            console.log(
                "Email:",
                email
            );

            console.log(
                "Department:",
                department
            );

            console.log(
                "Designation:",
                designation
            );

            console.log(
                "Basic Salary:",
                basicSalary
            );

            console.log(
                "HRA:",
                hra
            );

            console.log(
                "DA:",
                da
            );

            console.log(
                "Gross Salary:",
                grossSalary
            );

            console.log(
                "================================"
            );


            // ------------------------------------------
            // GET UPDATED EMPLOYEE LIST
            // ------------------------------------------

            const employees =
                await Employee.find();


            // ------------------------------------------
            // SHOW EMPLOYEE LIST
            // AND GENERATED PASSWORD
            // ------------------------------------------

            res.render(
                "employees",
                {
                    employees: employees,

                    success: true,

                    newEmployee: {
                        empId: empId,

                        password:
                            generatedPassword,

                        name: name
                    }
                }
            );

        } catch (error) {

            console.log(
                "================================"
            );

            console.log(
                "ADD EMPLOYEE ERROR:"
            );

            console.log(error);

            console.log(
                "================================"
            );

            res.status(500).send(
                "Error adding employee: " +
                error.message
            );
        }
    }
);

// ======================================================
// EDIT EMPLOYEE PAGE
// ======================================================

app.get(
    "/employees/edit/:id",
    isAdmin,
    async (req, res) => {

        try {

            const employee =
                await Employee.findById(
                    req.params.id
                );

            if (!employee) {

                return res.send(
                    "Employee not found"
                );
            }

            res.render(
                "edit-employee",
                {
                    employee: employee
                }
            );

        } catch (error) {

            console.log(
                "Edit Page Error:",
                error.message
            );

            res.status(500).send(
                "Error loading employee"
            );
        }
    }
);

// ======================================================
// UPDATE EMPLOYEE
// ======================================================

app.post(
    "/employees/edit/:id",
    isAdmin,
    async (req, res) => {

        try {

            // ------------------------------------------
            // GET FORM DATA
            // ------------------------------------------

            const name =
                req.body.name;

            const email =
                req.body.email;

            const department =
                req.body.department;

            const designation =
                req.body.designation;

            const basicSalary =
                Number(req.body.basicSalary);

            const joiningDate =
                req.body.joiningDate;


            // ------------------------------------------
            // VALIDATION
            // ------------------------------------------

            if (
                !name ||
                !email ||
                !department ||
                !designation ||
                !basicSalary ||
                !joiningDate
            ) {

                return res.send(
                    "Please fill all employee details."
                );
            }


            if (basicSalary <= 0) {

                return res.send(
                    "Basic salary must be greater than 0."
                );
            }


            // ------------------------------------------
            // SALARY CALCULATION
            // ------------------------------------------

            const hra =
                basicSalary * 0.20;

            const da =
                basicSalary * 0.10;

            const grossSalary =
                basicSalary +
                hra +
                da;


            // ------------------------------------------
            // UPDATE EMPLOYEE
            // ------------------------------------------

            await Employee.findByIdAndUpdate(
                req.params.id,
                {
                    name: name,

                    email: email,

                    department: department,

                    designation: designation,

                    basicSalary: basicSalary,

                    hra: hra,

                    da: da,

                    grossSalary: grossSalary,

                    joiningDate: joiningDate
                }
            );


            console.log(
                "Employee updated successfully"
            );


            // ------------------------------------------
            // REDIRECT
            // ------------------------------------------

            res.redirect("/employees");

        } catch (error) {

            console.log(
                "Update Employee Error:",
                error.message
            );

            res.status(500).send(
                "Error updating employee: " +
                error.message
            );
        }
    }
);

// ======================================================
// DELETE EMPLOYEE
// ======================================================

app.post(
    "/employees/delete/:id",
    isAdmin,
    async (req, res) => {

        try {

            await Employee.findByIdAndDelete(
                req.params.id
            );

            console.log(
                "Employee deleted successfully"
            );

            res.redirect("/employees");

        } catch (error) {

            console.log(
                "Delete Employee Error:",
                error.message
            );

            res.status(500).send(
                "Error deleting employee: " +
                error.message
            );
        }
    }
);

// ======================================================
// LOGOUT
// ======================================================

app.get(
    "/logout",
    (req, res) => {

        req.session.destroy(
            (error) => {

                if (error) {

                    console.log(
                        "Logout Error:",
                        error.message
                    );

                    return res.status(500).send(
                        "Error during logout"
                    );
                }

                res.redirect("/login");
            }
        );
    }
);

// ======================================================
// SERVER
// ======================================================

app.listen(
    PORT,
    () => {

        console.log(
            `Server running at http://localhost:${PORT}`
        );
    }
);