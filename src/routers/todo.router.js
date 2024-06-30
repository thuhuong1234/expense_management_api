const todoController = require("../controllers/todo.controller");
const router = require("express").Router();

router.route("/").get(todoController.getAllTodos);
router.route("/").post(todoController.createTodo);
router.route("/:id").get(todoController.getTodo);
router.route("/:id").put(todoController.updateTodo);
router.route("/:id").delete(todoController.deleteTodo);

module.exports = router;
