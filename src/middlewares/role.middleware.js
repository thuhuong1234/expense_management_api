const AppError = require("../utils/AppError");
const catchAsyncError = require("../utils/catchAsyncError");

const roleMiddleware = (isAdmin) =>
  catchAsyncError(async (req, res, next) => {
    if (req.user.isAdmin !== isAdmin) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  });

module.exports = roleMiddleware;
