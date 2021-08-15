const mongoose = require("mongoose");

const WishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true
  },
  itemsInWishlist: [{
    product: {type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  }}]
});

const Wishlist = mongoose.model("Wishlist", WishlistSchema);

module.exports = { Wishlist };