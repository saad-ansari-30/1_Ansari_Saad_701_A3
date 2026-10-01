const express = require("express");
const path = require("path");
const multer = require("multer");
const { body, validationResult } = require("express-validator");

const app = express();

const PORT = 3000;

// ======================================================
// EJS Configuration
// ======================================================

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// ======================================================
// Middleware
// ======================================================

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));


// ======================================================
// Multer Configuration
// ======================================================

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads");
    },

    filename: function (req, file, cb) {
        const uniqueName =
            Date.now() + "-" + Math.round(Math.random() * 1E9);

        cb(null, uniqueName + path.extname(file.originalname));
    }
});


// ======================================================
// File Validation
// ======================================================

const fileFilter = function (req, file, cb) {

    const allowedTypes = /jpeg|jpg|png|gif/;

    const extension =
        allowedTypes.test(path.extname(file.originalname).toLowerCase());

    const mimeType =
        allowedTypes.test(file.mimetype);

    if (extension && mimeType) {
        cb(null, true);
    } else {
        cb(new Error("Only JPG, JPEG, PNG and GIF images are allowed."));
    }
};


const upload = multer({
    storage: storage,

    fileFilter: fileFilter,

    limits: {
        fileSize: 2 * 1024 * 1024
    }
});


// ======================================================
// GET Registration Page
// ======================================================

app.get("/", (req, res) => {

    res.render("register", {
        errors: [],
        oldData: {},
        uploadedData: null
    });

});


// ======================================================
// POST Registration
// ======================================================

app.post(
    "/register",

    upload.fields([
        {
            name: "profilePic",
            maxCount: 1
        },
        {
            name: "otherPics",
            maxCount: 5
        }
    ]),

    [

        body("username")
            .trim()
            .notEmpty()
            .withMessage("Username is required.")
            .isLength({ min: 3 })
            .withMessage("Username must contain at least 3 characters."),

        body("password")
            .notEmpty()
            .withMessage("Password is required.")
            .isLength({ min: 6 })
            .withMessage("Password must contain at least 6 characters."),

        body("confirmPassword")
            .notEmpty()
            .withMessage("Confirm Password is required."),

        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required.")
            .isEmail()
            .withMessage("Please enter a valid email address."),

        body("gender")
            .notEmpty()
            .withMessage("Please select gender."),

        body("hobbies")
            .custom((value) => {

                if (!value) {
                    throw new Error("Please select at least one hobby.");
                }

                return true;
            }),

        body("confirmPassword")
            .custom((value, { req }) => {

                if (value !== req.body.password) {
                    throw new Error("Passwords do not match.");
                }

                return true;
            })

    ],

    (req, res) => {

        const errors = validationResult(req);

        // ==================================================
        // Get uploaded files
        // ==================================================

        const profilePic =
            req.files && req.files.profilePic
                ? req.files.profilePic[0]
                : null;

        const otherPics =
            req.files && req.files.otherPics
                ? req.files.otherPics
                : [];


        // ==================================================
        // File validation
        // ==================================================

        const fileErrors = [];

        if (!profilePic) {
            fileErrors.push({
                msg: "Profile picture is required."
            });
        }


        if (errors.isEmpty() && fileErrors.length === 0) {

            // ==============================================
            // All data is valid
            // ==============================================

            const uploadedData = {

                username: req.body.username,

                email: req.body.email,

                gender: req.body.gender,

                hobbies: Array.isArray(req.body.hobbies)
                    ? req.body.hobbies
                    : [req.body.hobbies],

                profilePic: profilePic
                    ? "/uploads/" + profilePic.filename
                    : null,

                otherPics: otherPics.map(file => {
                    return "/uploads/" + file.filename;
                })

            };


            res.render("result", {
                data: uploadedData
            });

        } else {

            // ==============================================
            // Validation failed
            // ==============================================

            const allErrors = [
                ...errors.array(),
                ...fileErrors
            ];

            res.render("register", {

                errors: allErrors,

                oldData: req.body,

                uploadedData: null

            });

        }

    }
);


// ======================================================
// Download Route
// ======================================================

app.get("/download/:filename", (req, res) => {

    const filePath = path.join(
        __dirname,
        "public",
        "uploads",
        req.params.filename
    );

    res.download(filePath, (err) => {

        if (err) {
            console.log("Download error:", err.message);
        }

    });

});


// ======================================================
// Error Handler
// ======================================================

app.use((err, req, res, next) => {

    console.log(err.message);

    res.render("register", {

        errors: [
            {
                msg: err.message
            }
        ],

        oldData: req.body || {},

        uploadedData: null

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