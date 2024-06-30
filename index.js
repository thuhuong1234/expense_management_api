require("dotenv").config();
const errorHandler = require("./src/middlewares/error.middleware");

var morgan = require("morgan");

const express = require("express");
const app = express();

app.use(morgan("dev"));

const port = process.env.PORT || 3000;

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server run with port: ${port}`);
});
