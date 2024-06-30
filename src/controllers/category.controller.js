const categoryService = require("../services/category.service");
const catchAsyncError = require("../utils/catchAsyncError");
const AppError = require("../utils/AppError");

const getAllCategories = catchAsyncError(async (req, res, next) => {
  const categories = await categoryService.getAllCategories();
  return res.status(201).json(categories);
});

const createCategory = catchAsyncError(async (req, res, next) => {
  const { name } = req.body;
  const newCategory = await categoryService.createCategory(req.body);

  return res.status(201).json(newCategory);
});

const getCategory = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const category = await categoryService.getCategory(id);
  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  return res.status(201).json(category);
});

const updateCategory = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const category = await categoryService.getCategory(id);
  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  const updatedCategory = await categoryService.updateCategory(id, req.body);
  return res.status(201).json(updatedCategory);
});

const deleteCategory = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const category = await categoryService.getCategory(id);
  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  const deletedCategory = await categoryService.deleteCategory(id);
  return res.status(201).json(deletedCategory);
});

module.exports = {
  getAllCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
};
