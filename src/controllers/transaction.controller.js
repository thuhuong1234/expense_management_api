const transactionService = require("../services/transaction.service");
const catchAsyncError = require("../utils/catchAsyncError");
const AppError = require("../utils/appError");
const generateExcel = require("../utils/downloadFile");

const getAllTransactions = catchAsyncError(async (req, res, next) => {
  const transactions = await transactionService.getAllTransactions(req.query);
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
    +id,
    req.body
  );
  return res.status(201).json(updatedTransaction);
});

const deleteTransaction = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const transaction = await transactionService.getTransaction(+id);
  if (!transaction) {
    return next(new AppError("Transaction not found", 404));
  }

  const deletedTransaction = await transactionService.deleteTransaction(+id);
  return res.status(201).json(deletedTransaction);
});
const getStatistics = catchAsyncError(async (req, res, next) => {
  const userId = req.user.id;
  const roomId = req.query.roomId;
  const id = roomId ? { roomId: +roomId } : { userId: +userId };
  const { type } = req.query;
  if (!type || !["day", "week", "month", "year"].includes(type)) {
    return res
      .status(400)
      .json({ message: "Invalid or missing type parameter" });
  }
  const transactions = await transactionService.getStatistics(id, type);
  return res.status(201).json(transactions);
});

const downloadTransactions = catchAsyncError(async (req, res, next) => {
  const query = { ...req.query, all: true };
  const data = await transactionService.getAllTransactions(query);
  if (!data.transactions || !Array.isArray(data.transactions)) {
    return next(new AppError("Transactions not found", 404));
  }
  const columns = [
    { header: "Room", width: 25 },
    { header: "Description", width: 30 },
    { header: "Amount", width: 25 },
    { header: "Category", width: 25 },
    { header: "User_transactions", width: 40 },
    { header: "", width: 20 },
    { header: "Date", width: 30 },
  ];
  const rowTitle = ["", "", "", "", "User", "Amount", ""];
  const file = await generateExcel({
    rows: data.transactions,
    columns,
    rowTitle,
    sheetName: "Transaction_Report",
    customLayout: true,
    fillWorksheetRows: transactionService.fillWorksheetRows,
  });

  res.download(file, (err) => {
    if (err) {
      return next(new AppError("File not found", 404));
    }
  });
});
module.exports = {
  getAllTransactions,
  createTransaction,
  getTransaction,
  updateTransaction,
  deleteTransaction,
  getStatistics,
  downloadTransactions,
};
