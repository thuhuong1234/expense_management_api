const transactionController = require("../controllers/transaction.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const router = require("express").Router();

router.route("/").get(transactionController.getAllTransactions);

router.use(authMiddleware);
router.route("/download").get(transactionController.downloadTransactions);
router.route("/statistics").get(transactionController.getStatistics);
router.route("/").post(transactionController.createTransaction);
router.route("/:id").get(transactionController.getTransaction);
router.route("/:id").put(transactionController.updateTransaction);
router.route("/:id").delete(transactionController.deleteTransaction);

module.exports = router;
