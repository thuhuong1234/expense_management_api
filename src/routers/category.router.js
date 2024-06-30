const express = require("express");
const categoryRouter = express.Router();

const categoryController = require("../controllers/category.controller");

categoryRouter.route("/").post(categoryController.createCategory);
categoryRouter.route("/:id").get(categoryController.getCategory);
categoryRouter.route("/:id").put(categoryController.updateCategory);

module.exports = categoryRouter;
