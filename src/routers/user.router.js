const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const upload = require("../middlewares/upload.middleware");
const router = require("express").Router();

router.route("/").get(userController.getAllUsers);

router.use(authMiddleware);
router.route("/").post(userController.createUser);
router.route("/:id").get(userController.getUser);
router.route("/:id").put(upload.single("avatar"), userController.updateUser);
router.route("/:id").delete(userController.deleteUser);

module.exports = router;
