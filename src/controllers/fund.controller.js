const fundService = require("../services/fund.service");
const catchAsyncError = require("../utils/catchAsyncError");

const createFund = catchAsyncError(async (req, res, next) => {
  const newFund = await fundService.createFund(req.body);
  return res.status(201).json(newFund);
});


module.exports = {
  createFund,
};
