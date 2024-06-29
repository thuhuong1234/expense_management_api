require("dotenv").config();
var morgan = require("morgan");

const express = require("express");
const app = express();

app.use(morgan("dev"));

app.get("/", function (req, res) {
  res.send("Hello World");
});
const port = process.env.PORT || 3000;

app.listen(port);
