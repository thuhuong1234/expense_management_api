const catchAsyncError = (asyncFunction) => (req, res, next) =>
  asyncFunction(req, res, next).catch(next);

module.exports = catchAsyncError;
