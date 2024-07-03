const todoController = require("../controllers/todo.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const router = require("express").Router();

router.route("/").get(todoController.getAllTodos);

router.use(authMiddleware, roleMiddleware(true));

router.route("/").post(todoController.createTodo);
router.route("/:id").get(todoController.getTodo);
router.route("/:id").put(todoController.updateTodo);
router.route("/:id").delete(todoController.deleteTodo);

module.exports = router;
