const authControllers = require("../controllers/auth.controller");

const router = require("express").Router();

router.route("/login").post(authControllers.login);

module.exports = router;
