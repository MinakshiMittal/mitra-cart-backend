const express = require("express");
const router = express.Router();
const {Cart} = require("../models/cart.model");
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
    const cart = Cart.findOne({userId});

    if(cart) {
      const populatedCart = await cart.populate("itemsInCart.product");

      return res.json({success: true, cart: populatedCart});
    }
    res.json({success: false, message: "No cart for this user."});

  } catch (error) {
    res.status(500).json({success: false, errorMessage: error.message});
  }
})
.post(async(req, res) => {
  try {
    const {userId} = req.user;
    const product = req.body;

    const cart = await Cart.findOne({userId});

    console.log(cart)

    if(cart) {
      const productAlreadyInCart = _.some(cart.itemsInCart, (productItem) => productItem.product.toString() === product.product._id);

      if(productAlreadyInCart) {
        return res.status(409).json({success: false, message: "Product is already present"});
      }

      cart.itemsInCart.addToSet(product);
      await cart.save();

      res.json({success: true});
    }
    else {
      const cart = new Cart({
        userId,
        itemsInCart: [product]  
      });
      await cart.save();

      res.json({success: true, cart})
    }
  } catch (error) {
    res.status(500).json({success: false, errorMessage: error.message});
  }
});

router.delete("/:productId", async(req, res) => {
  try {
    const { userId } = req.user;
    const { productId } = req.params;
    let cart = await Cart.findOne({ userId });

    cart = _.extend(cart, {
      itemsInCart: _.filter(cart.itemsInCart, (productItem) => 
        productItem.product.toString() !== productId
      ),
    });
    await cart.save();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, errorMessage: error.message });
  }
});

router.route("/:productId").post(async (req, res) => {
  try{
  const { userId } = req.user;
  const { productId } = req.params;
  const updateInCartItem = req.body;

  let cart = await Cart.findOne({ userId });

  const updatedCartItem = _.extend(cart, {
    itemsInCart: _.map(cart.itemsInCart, (productItem) => {
      if (productItem.product.toString() === productId) {
        return extend(productItem, updateInCartItem);
      } else {
        return productItem;
      }
    }),
  });

  await updatedCartItem.save();
  res.status(200).json({ success: true });
  }
  catch(error){
  res.status(500).json({ success: false, errorMessage: error.message });
  }
});

module.exports = router;