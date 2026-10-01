const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");

dotenv.config();

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
// MONGODB CONNECTION
// ==========================================

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {

        console.log("MongoDB Connected");

    })
    .catch((error) => {

        console.log(
            "MongoDB Connection Error:",
            error.message
        );

    });


// ==========================================
// HOME
// ==========================================

app.get("/", (req, res) => {

    res.json({
        message: "Q7 Shopping Cart Backend Running"
    });

});


// ==========================================
// ROUTES
// ==========================================

app.use(
    "/api/categories",
    categoryRoutes
);

app.use(
    "/api/products",
    productRoutes
);


// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {

    console.log(
        `Backend running at http://localhost:${PORT}`
    );

});