const mongoose = require("mongoose");
const express = require("express");
const { Category } = require("../models/category.model");

const router = express.Router();

router
  .route("/")
  .get(async (req, res) => {
    try {
      const categories = await Category.find({});
      res.json({ success: true, categories });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Unable to get categories",
        errorMessage: error.message,
      });
    }
  })
  .post(async (req, res) => {
    try {
      const category = req.body;
      const NewCategory = new Category(category);
      await NewCategory.save();
      res.json({ success: true, category });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Unable to add category",
        errorMessage: error.message,
      });
    }
  });

router.param("categoryId", async (req, res, next, categoryId) => {
  try {
    const category = await Category.findById(categoryId).populate("products.product");

    if (!category) {
      return res
        .status(400)
        .json({ success: false, message: "error finding category" });
    }
    req.category = category;
    next();
  } catch {
    res
      .status(500)
      .json({ success: false, messgae: "error while retrieving the category" });
  }
});

router.route("/:categoryId").get(async (req, res) => {
  console.log(req.body);
  const {category} = req;
  res.status(200).json({ category, success: true });
});

module.exports = router;
