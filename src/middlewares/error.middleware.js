const errorHandler = (err, req, res, next) => {
  if (err.code === "P2002") {
    err.statusCode = 400;
    err.message = ` ${err.meta.target.split("_").join(" ")} already exists`;
  }
  if (err.code === "P2025" && err.meta?.target) {
    err.statusCode = 400;
    err.message = ` ${err.meta.target.split("_").join(" ")} not found`;
  } else if (err.code === "P2025") {
    err.statusCode = 400;
    err.message = `Record not found`;
  }
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  res.status(statusCode).json({ message });
};

module.exports = errorHandler;
