const fundController = require("../controllers/fund.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = require("express").Router();

router.route("/").post(authMiddleware, fundController.createFund);

module.exports = router;
