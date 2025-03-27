const authControllers = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const router = require("express").Router();

router.route("/login").post(authControllers.login);
router.route("/forgot-password").post(authControllers.forgotPassword);
router.route("/reset-password").post(authControllers.resetPassword);
router.use(authMiddleware).route("/user").get(authControllers.getUser);

module.exports = router;
