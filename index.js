require("dotenv").config();
const express = require("express");
const router = require("./src/routers/index");
const errorHandler = require("./src/middlewares/error.middleware");
const validatorHandler = require("./src/middlewares/validator.middleware");
const morgan = require("morgan");

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

app.use(morgan("dev"));

app.use(validatorHandler);

app.use("/api/v1", router);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
