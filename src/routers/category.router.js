const express = require("express");
const categoryRouter = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const categoryController = require("../controllers/category.controller");

const upload = require("../middlewares/upload.middleware");
categoryRouter.route("/").get(categoryController.getAllCategories);
categoryRouter.use(authMiddleware);
categoryRouter
  .route("/")
  .post(upload.single("avatarUrl"), categoryController.createCategory);
categoryRouter.route("/:id").get(categoryController.getCategory);
categoryRouter
  .route("/:id")
  .put(upload.single("avatarUrl"), categoryController.updateCategory);
categoryRouter.route("/:id").delete(categoryController.deleteCategory);

module.exports = categoryRouter;
