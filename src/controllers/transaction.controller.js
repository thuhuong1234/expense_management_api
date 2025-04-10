const transactionService = require("../services/transaction.service");
const catchAsyncError = require("../utils/catchAsyncError");
const AppError = require("../utils/appError");

const getAllTransactions = catchAsyncError(async (req, res, next) => {
  const transactions = await transactionService.getAllTransactions();
  return res.status(201).json(transactions);
});

const createTransaction = catchAsyncError(async (req, res, next) => {
  const { amount, userTransactions, categoryId, roomId, ...rest } = req.body;
  const userId = req.user.id;
  const participants =
    !userTransactions ||
    !Array.isArray(userTransactions) ||
    userTransactions.length === 0
      ? [req.user.id]
      : userTransactions;

  const transaction = await transactionService.createTransaction({
    amount,
    categoryId,
    roomId,
    userId,
    userTransactions: participants,
    ...rest,
  });

  return res.status(201).json(transaction);
});

const getTransaction = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const transaction = await transactionService.getTransaction(+id);
  if (!transaction) {
    return next(new AppError("Transaction not found", 404));
  }

  return res.status(201).json(transaction);
});

const updateTransaction = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const transaction = await transactionService.getTransaction(+id);
  if (!transaction) {
    return next(new AppError("Transaction not found", 404));
  }

  const updatedTransaction = await transactionService.updateTransaction(
    id,
    req.body
  );
  return res.status(201).json(updatedTransaction);
});

const deleteTransaction = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const transaction = await transactionService.getTransaction(id);
  if (!transaction) {
    return next(new AppError("Transaction not found", 404));
  }

  const deletedTransaction = await transactionService.deleteTransaction(id);
  return res.status(201).json(deletedTransaction);
});
const getStatistics = catchAsyncError(async (req, res, next) => {
  const userId = req.user.id;
  const { type } = req.query;
  if (!type || !["day", "week", "month", "year"].includes(type)) {
    return res
      .status(400)
      .json({ message: "Invalid or missing type parameter" });
  }
  const transactions = await transactionService.getStatistics(userId, type);

  return res.status(201).json(transactions);
});
module.exports = {
  getAllTransactions,
  createTransaction,
  getTransaction,
  updateTransaction,
  deleteTransaction,
  getStatistics,
};
