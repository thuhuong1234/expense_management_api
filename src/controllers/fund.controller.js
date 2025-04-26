const fundService = require("../services/fund.service");
const catchAsyncError = require("../utils/catchAsyncError");
const AppError = require("../utils/appError");

const createFund = catchAsyncError(async (req, res, next) => {
  const userId = req.user?.id;
  const newFund = await fundService.createFund(+userId, req.body);
  return res.status(201).json(newFund);
});

const getFund = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const fund = await fundService.getFund(+id);
  if (!fund) {
    return next(new AppError("Fund not found", 404));
  }
  return res.status(201).json(fund);
});

const updateFund = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user?.id;
  const updatedFund = await fundService.updateFund(+id, userId, req.body);
  return res.status(201).json(updatedFund);
});

module.exports = {
  createFund,
  getFund,
  updateFund,
};
