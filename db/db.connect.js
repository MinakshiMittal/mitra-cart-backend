const mongoose = require("mongoose");

const mongoDBConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    console.log("DB connected successfully");
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = { mongoDBConnection };
