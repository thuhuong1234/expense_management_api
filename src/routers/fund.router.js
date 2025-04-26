const fundController = require("../controllers/fund.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = require("express").Router();

router.route("/").post(authMiddleware, fundController.createFund);
router.route("/:id").get(authMiddleware, fundController.getFund);
router.route("/:id").put(authMiddleware, fundController.updateFund);

module.exports = router;
