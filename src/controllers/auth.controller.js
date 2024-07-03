const authService = require("../services/auth.service");
const catchAsyncError = require("../utils/catchAsyncError");
const AppError = require("../utils/AppError");
const jwtService = require("../services/jwt.service");

const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await authService.login(email, password);
  if (!user) {
    return next(new AppError("Login failed", 404));
  }

  const token = await jwtService.accessToken(user);
  return res.status(201).json({
    user,
    token,
  });
});

module.exports = { login };
