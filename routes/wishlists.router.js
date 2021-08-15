const express = require("express");
const router = express.Router();
const {Wishlist} = require("../models/wishlist.model");
const {_, extend} = require("lodash");
const jwt = require("jsonwebtoken");

router.use(async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    res
      .status(401)
      .json({ success: false, errorMessage: "Unauthorized access" });
  }
});

router.route("/")
.get(async (req, res) => {
  try {
    const {userId} = req.user;
    const wishlist = Wishlist.findOne({userId});

    if(wishlist) {
      const populatedWishlist = await wishlist.populate("itemsInWishlist.product");

      return res.json({success: true, wishlist: populatedWishlist});
    }
    res.json({success: false, message: "No wishlist for this user."});

  } catch (error) {
    res.status(500).json({success: false, errorMessage: error.message});
  }
})
.post(async(req, res) => {
  try {
    const {userId} = req.user;
    const product = req.body;

    const wishlist = await Wishlist.findOne({userId});

    if(wishlist) {
      const productAlreadyInWishlist = _.some(wishlist.itemsInWishlist, (productItem) => productItem.product.toString() === product.product._id);

      if(productAlreadyInWishlist) {
        return res.status(409).json({success: false, message: "Product is already present"});
      }

      wishlist.itemsInWishlist.addToSet(product);
      await wishlist.save();

      res.json({success: true});
    }
    else {
      const wishlist = new Wishlist({
        userId,
        itemsInWishlist: [product]
      });
      await wishlist.save();

      res.json({success: true})
    }
  } catch (error) {
    res.status(500).json({success: false, errorMessage: error.message});
  }
});

router.delete("/:productId", async(req, res) => {
  try {
    const { userId } = req.user;
    const { productId } = req.params;
    let wishlist = await Wishlist.findOne({ userId });

    wishlist = _.extend(wishlist, {
      itemsInWishlist: _.filter(wishlist.itemsInWishlist, (productItem) => 
        productItem.product.toString() !== productId
      ),
    });
    await wishlist.save();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, errorMessage: error.message });
  }
});

module.exports = router;