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

module.exports = {
  createUser,
};
