const categoryService = require("../services/category.service");
const catchAsyncError = require("../utils/catchAsyncError");

const createCategory = catchAsyncError(async (req, res, next) => {
  const { name } = req.body;
  const newCategory = await categoryService.createCategory(req.body);

  return res.status(201).json(newCategory);
});

module.exports = { createCategory };
