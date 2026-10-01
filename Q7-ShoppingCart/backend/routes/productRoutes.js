const express = require("express");

const router = express.Router();

const Product = require("../models/Product");


// ==========================================
// GET ALL PRODUCTS
// ==========================================

router.get("/", async (req, res) => {

    try {

        const products = await Product
            .find()
            .populate("category", "name parentCategory")
            .sort({ createdAt: -1 });

        res.json(products);

    } catch (error) {

        res.status(500).json({
            message: "Error getting products"
        });

    }

});


// ==========================================
// GET SINGLE PRODUCT
// ==========================================

router.get("/:id", async (req, res) => {

    try {

        const product = await Product
            .findById(req.params.id)
            .populate("category", "name");

        if (!product) {

            return res.status(404).json({
                message: "Product not found"
            });

        }

        res.json(product);

    } catch (error) {

        res.status(500).json({
            message: "Error getting product"
        });

    }

});


// ==========================================
// CREATE PRODUCT
// ==========================================

router.post("/", async (req, res) => {

    try {

        const {
            name,
            description,
            price,
            image,
            category,
            stock
        } = req.body;


        if (!name || !price || !category) {

            return res.status(400).json({
                message: "Name, price and category are required"
            });

        }


        const product = new Product({

            name,

            description,

            price: Number(price),

            image,

            category,

            stock: Number(stock) || 0

        });


        await product.save();


        const savedProduct = await Product
            .findById(product._id)
            .populate("category", "name");


        res.status(201).json(savedProduct);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error creating product"
        });

    }

});


// ==========================================
// UPDATE PRODUCT
// ==========================================

router.put("/:id", async (req, res) => {

    try {

        const {
            name,
            description,
            price,
            image,
            category,
            stock
        } = req.body;


        const product = await Product.findByIdAndUpdate(

            req.params.id,

            {
                name,
                description,
                price: Number(price),
                image,
                category,
                stock: Number(stock)
            },

            {
                new: true
            }

        ).populate("category", "name");


        if (!product) {

            return res.status(404).json({
                message: "Product not found"
            });

        }


        res.json(product);

    } catch (error) {

        res.status(500).json({
            message: "Error updating product"
        });

    }

});


// ==========================================
// DELETE PRODUCT
// ==========================================

router.delete("/:id", async (req, res) => {

    try {

        const product = await Product.findByIdAndDelete(
            req.params.id
        );


        if (!product) {

            return res.status(404).json({
                message: "Product not found"
            });

        }


        res.json({
            message: "Product deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: "Error deleting product"
        });

    }

});


module.exports = router;