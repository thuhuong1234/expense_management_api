const transactionService = require("../services/transaction.service");
const catchAsyncError = require("../utils/catchAsyncError");
const AppError = require("../utils/AppError");

const getAllTransactions = catchAsyncError(async (req, res, next) => {
  const transactions = await transactionService.getAllTransactions();
  return res.status(201).json(transactions);
});

const createTransaction = catchAsyncError(async (req, res, next) => {
  const { amount, userTransactions, categoryId, roomId, ...rest } = req.body;
  const userId = req.user.id;
  if (
    !userTransactions ||
    !Array.isArray(userTransactions) ||
    userTransactions.length === 0
  ) {
    return next(new AppError("Participants are required", 400));
  }

  const transaction = await transactionService.createTransaction({
    amount,
    categoryId,
    roomId,
    userId,
    userTransactions,
    ...rest,
  });

  return res.status(201).json(transaction);
});

const getTransaction = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const transaction = await transactionService.getTransaction(+id);
  console.log(transaction);

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

module.exports = {
  getAllTransactions,
  createTransaction,
  getTransaction,
  updateTransaction,
  deleteTransaction,
};
