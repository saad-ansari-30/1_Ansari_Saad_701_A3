const express = require("express");

const router = express.Router();

const Category = require("../models/Category");


// ==========================================
// GET ALL CATEGORIES
// ==========================================

router.get("/", async (req, res) => {

    try {

        const categories = await Category
            .find()
            .populate("parentCategory", "name")
            .sort({ name: 1 });

        res.json(categories);

    } catch (error) {

        res.status(500).json({
            message: "Error getting categories"
        });

    }

});


// ==========================================
// GET MAIN CATEGORIES
// ==========================================

router.get("/main", async (req, res) => {

    try {

        const categories = await Category.find({
            parentCategory: null
        }).sort({ name: 1 });

        res.json(categories);

    } catch (error) {

        res.status(500).json({
            message: "Error getting main categories"
        });

    }

});


// ==========================================
// GET SUBCATEGORIES
// ==========================================

router.get("/sub/:parentId", async (req, res) => {

    try {

        const categories = await Category.find({
            parentCategory: req.params.parentId
        }).sort({ name: 1 });

        res.json(categories);

    } catch (error) {

        res.status(500).json({
            message: "Error getting subcategories"
        });

    }

});


// ==========================================
// CREATE CATEGORY
// ==========================================

router.post("/", async (req, res) => {

    try {

        const { name, parentCategory } = req.body;

        if (!name) {

            return res.status(400).json({
                message: "Category name is required"
            });

        }

        const category = new Category({
            name,
            parentCategory: parentCategory || null
        });

        await category.save();

        res.status(201).json(category);

    } catch (error) {

        res.status(500).json({
            message: "Error creating category"
        });

    }

});


// ==========================================
// UPDATE CATEGORY
// ==========================================

router.put("/:id", async (req, res) => {

    try {

        const { name, parentCategory } = req.body;

        const category = await Category.findByIdAndUpdate(
            req.params.id,
            {
                name,
                parentCategory: parentCategory || null
            },
            {
                new: true
            }
        );

        if (!category) {

            return res.status(404).json({
                message: "Category not found"
            });

        }

        res.json(category);

    } catch (error) {

        res.status(500).json({
            message: "Error updating category"
        });

    }

});


// ==========================================
// DELETE CATEGORY
// ==========================================

router.delete("/:id", async (req, res) => {

    try {

        // Check whether this category has subcategories
        const children = await Category.find({
            parentCategory: req.params.id
        });

        if (children.length > 0) {

            return res.status(400).json({
                message: "Delete subcategories first"
            });

        }

        // Check whether products use this category
        const Product = require("../models/Product");

        const products = await Product.find({
            category: req.params.id
        });

        if (products.length > 0) {

            return res.status(400).json({
                message: "This category contains products. Delete or move the products first."
            });

        }

        await Category.findByIdAndDelete(req.params.id);

        res.json({
            message: "Category deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: "Error deleting category"
        });

    }

});


module.exports = router;