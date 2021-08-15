const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: "Product name is required!",
    unique: true
  },
  aboutThisItem: {
    type: [String],
    trime: true,
  },
  price: {
    type: Number,
    required: true
  },
  stock: {
    type:Number,
    required: true,
  },
  discount: Boolean,
  offer: Number,
  rating: Number,
  isFastDelivery: Boolean,
  imageUrl: {
    type: String,
    trim: true,
    required: "Product image url is required!"
  },
  category: {
    type: String,
    trim:true,
    required: "Product Category is required!"
  }
});

const Product = mongoose.model("Product", ProductSchema);

module.exports = {Product};
