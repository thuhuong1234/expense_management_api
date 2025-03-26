const authService = require("../services/auth.service");
const catchAsyncError = require("../utils/catchAsyncError");
const AppError = require("../utils/AppError");
const jwtService = require("../services/jwt.service");
const prisma = require("../prisma");
const { createToken } = require("../services/token.service");
const login = catchAsyncError(async (req, res, next) => {
  const { email, password, rememberToken } = req.body;
  const user = await authService.login(email, password);
  if (!user) {
    return next(new AppError("Login failed", 404));
  }
  const token = jwtService.accessToken(user);

  if (rememberToken) {
    const refreshToken = jwtService.refreshToken(user);
    console.log(token);
    createToken(user, refreshToken);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });
  }

  return res.status(201).json({
    user,
    token,
  });
});
const getUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.user;
  const user = await authService.getUser(id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  return res.status(201).json(user);
});

module.exports = { login, getUser };
