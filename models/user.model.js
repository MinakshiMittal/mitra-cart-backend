const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First Name cannot be empty."]
  },
  lastName: {
    type: String,
    required: [true, "Last Name cannot be empty."]
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "Email can't be empty."],
    match: /\S+@\S+\.\S+/
  },
  password: {
    type: String,
    required: [true, "Password cannot be empty"]
  }
});

const User = mongoose.model("User", UserSchema);

module.exports = { User };