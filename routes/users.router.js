const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user.model");
const router = express.Router();

router.route("/signup")
.post(async (req, res) => {
  try {
    const user = req.body;
    console.log(user)
    if(!(user.firstName && user.lastName && user.email && user.password)) {
      return res.status(406).json({success: false, message: "Enter all the details"})
    }

    console.log(user.email);

    const existingUser = await User.findOne({email: user.email});

    if(existingUser) {
      return res.status(409).json({success: false, message: "User already exists. Try to login."})
    }

    const NewUser = new User(user);
    const salt = await bcrypt.genSalt(10);
    NewUser.password = await bcrypt.hash(NewUser.password, salt); 
    await NewUser.save();

    res.json({success: true, message: "Successfully Signed Up"});
  } catch (error) {
    res.status(500).json({success: false, errorMessage: error.message, message: "Unable to add user"});
  }
});

router.route("/login")
.post(async (req, res) => {
  try {
    const user = req.body;
    const userFound = await User.findOne({email: user.email});

    if(userFound) {
      const validPassword = await bcrypt.compare(user.password, userFound.password);
      if(validPassword) {
        let token = jwt.sign({userId: userFound._id}, process.env.JWT_SECRET, { expiresIn: "24h"});

        token = `Bearer ${token}`;
        return res.json({success: true, token, userId: userFound._id});
      }
      return res.status(403).json({success: false, errorMessage: "Incorrect password."});
    }
    return res.status(403).json({success: false, errorMessage: "Incorrect email."})
  } catch(error) {
    res.status(500).json({success: false, message: "Unable to find user", errorMessage: error.message});
  }
});

module.exports = router;