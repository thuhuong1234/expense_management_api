const userService = require("../services/user.service");
const catchAsyncError = require("../utils/catchAsyncError");
const AppError = require("../utils/AppError");
const bcryptService = require("../services/bcrypt");

const createUser = catchAsyncError(async (req, res, next) => {
  const { password } = req.body;
  const hashedPassword = await bcryptService.hashPassword(password);
  const newUser = await userService.createUser({
    ...req.body,
    password: hashedPassword,
  });

  return res.status(201).json(newUser);
});

const getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await userService.getAllUsers();
  if (!users) {
    return next(new AppError("Users not found", 404));
  }

  return res.status(201).json(users);
});

const getUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const user = await userService.getUser(+id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  return res.status(201).json(user);
});

const updateUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const user = await userService.getUser(+id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const updatedUser = await userService.updateUser(+id, req.body);
  return res.status(201).json(updatedUser);
});

const deleteUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const user = await userService.getUser(+id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const deletedUser = await userService.deleteUser(+id);
  return res.status(201).json(deletedUser);
});

module.exports = {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
};
