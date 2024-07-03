const authControllers = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const router = require("express").Router();

router.route("/login").post(authControllers.login);

router.use(authMiddleware);

router.route("/user").get(authControllers.getUser);

module.exports = router;
