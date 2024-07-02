const userController = require("../controllers/user.controller");
const router = require("express").Router();

router.route("/").post(userController.createUser);
router.route("/").get(userController.getAllUsers);
router.route("/:id").get(userController.getUser);
router.route("/:id").patch(userController.updateUser);
router.route("/:id").delete(userController.deleteUser);

module.exports = router;
