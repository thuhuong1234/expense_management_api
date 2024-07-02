const userController = require("../controllers/user.controller");
const router = require("express").Router();

router.route("/").post(userController.createUser);

module.exports = router;
