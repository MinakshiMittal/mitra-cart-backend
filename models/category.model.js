const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: "Category name is required!",
    unique: true,
  },
  imageUrl: {
    type: String,
    required: "Project category image url is required!",
    trim: true
  },
  products: [{
    product: {type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  }}]
});

const Category = mongoose.model("Category", CategorySchema);

module.exports = { Category };