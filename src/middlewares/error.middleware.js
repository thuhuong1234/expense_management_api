const errorHandler = (err, req, res, next) => {
  if (err.code === "P2002") {
    err.statusCode = 400;
    err.message = ` ${err.meta.target.split("_").join(" ")} already exists`;
  }
  const statusCode = err.status || 500;
  const message = err.message || "Internal server error";
  res.status(statusCode).json({ message });
};

module.exports = errorHandler;
