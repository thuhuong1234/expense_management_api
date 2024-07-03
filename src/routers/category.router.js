const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

const categoryRouter = express.Router();

const categoryController = require("../controllers/category.controller");

categoryRouter.route("/").get(categoryController.getAllCategories);

categoryRouter.use(authMiddleware, roleMiddleware(true));

categoryRouter.route("/").post(categoryController.createCategory);
categoryRouter.route("/:id").get(categoryController.getCategory);
categoryRouter.route("/:id").put(categoryController.updateCategory);
categoryRouter.route("/:id").delete(categoryController.deleteCategory);

module.exports = categoryRouter;
