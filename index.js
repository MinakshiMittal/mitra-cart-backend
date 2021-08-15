const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const { mongoDBConnection } = require("./db/db.connect");
const categories = require("./routes/categories.router");
const products = require("./routes/products.router");
const user = require("./routes/users.router");
const cart = require("./routes/carts.router");
const wishlist = require("./routes/wishlists.router");

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoDBConnection();

app.use("/categories", categories);
app.use("/products", products);
app.use("/user", user);
app.use("/cart", cart);
app.use("/wishlist", wishlist);

app.get('/', (req, res) => {
  res.send('Welcome to MITRA-CART');
});

app.use((req, res) => {
  res.status(400).json({
    success: false,
    messageg: "Route not found on server, please check."
  });
});

app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({
    success: false,
    message: "error occurred, see the errorMessage key for more details",
    errorMessage: error.message
  });
});

app.listen(3000, () => {
  console.log('server started');
});