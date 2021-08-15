const mongoose = require("mongoose");
const express = require("express");
const { Product } = require("../models/product.model");
const { Category } = require("../models/category.model");

const router = express.Router();

router
  .route("/")
  .get(async (req, res) => {
    try {
      const products = await Product.find({});
      res.json({ products, success: true });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Unable to get products",
        errorMessage: error.message
      });
    }
  })
  .post(async (req, res) => {
    try {
      let product = req.body;
      const category = product.category;
      const categoryFound = await Category.findOne({ name: category });

      if (categoryFound) {
        const NewProduct = new Product(product);
        await NewProduct.save();
        
        res.json({ success: true, product });
      } else {
        res.json({ success: false, message: "Product Category not available" });
      }
    } catch (error) {
      res.status(500).json({
        success: true,
        message: "Unable to save new product",
        errorMessage: error.message
      });
    }
  });

router.param("productId", async (req, res, next, productId) => {
  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res
        .status(400)
        .json({ success: false, message: "error finding product" });
    }
    req.product = product;
    next();
  } catch {
    res
      .status(500)
      .json({ success: false, messgae: "error while retrieving the product" });
  }
});

router.get("/:productId", async (req, res) => {
  const { product } = req;
  res.json({ success: true, product });
});

module.exports = router;
