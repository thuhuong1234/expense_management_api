const authService = require("../services/auth.service");
const catchAsyncError = require("../utils/catchAsyncError");
const AppError = require("../utils/appError");
const jwtService = require("../services/jwt.service");
const prisma = require("../prisma");
const sendEmail = require("../services/sendEmail"); 
const httpStatus = require("http-status");

const login = catchAsyncError(async (req, res, next) => {
  const { email, password, rememberToken } = req.body;
  const user = await authService.login(email, password);
  if (!user) {
    return next(new AppError("Login failed", 404));
  }
  const token = jwtService.generateAccessToken(user);
  await authService.refreshToken(user, res);
  // if (rememberToken) {
  //   await authService.refreshToken(user);
  // }
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

const forgotPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.query;
  if (!email) {
    throw new AppError("Missing email!", httpStatus.NOT_FOUND);
  }
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError("User not found!", httpStatus.NOT_FOUND);
  }
  const refreshToken = await authService.generateResetToken(user);
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${refreshToken}`;
  const message = `Click vào link sau để đặt lại mật khẩu: <a href="${resetUrl}">Đặt lại mật khẩu</a>. Link này sẽ hết hạn sau 15 phút.`;
  await sendEmail(email, message);
  return res.status(201).json({
    message: "Send email successfully!",
  });
});

const resetPassword = catchAsyncError(async (req, res, next) => {
  const { password, token } = req.body;
  if (!token) throw new AppError("Missing token!", httpStatus.BAD_REQUEST);
  if (!password)
    throw new AppError("Missing new password!", httpStatus.BAD_REQUEST);
  await authService.resetPassword(token, password);

  return res.status(201).json({
    message: "Reset password successfully!",
  });
});
module.exports = { login, getUser, forgotPassword, resetPassword };
