const jwtService = require("../services/jwt.service");
const AppError = require("../utils/appError");
const catchAsyncError = require("../utils/catchAsyncError");

const authMiddleware = catchAsyncError(async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return next(new AppError("Unauthorized", 401));
  }
  const user = jwtService.verifyToken(token);
  if (!user) {
    return next(new AppError("Unauthorized", 401));
  }

  req.user = user;
  next();
});

module.exports = authMiddleware;
