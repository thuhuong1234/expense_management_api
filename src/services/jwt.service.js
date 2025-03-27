const jwt = require("jsonwebtoken");
const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || "1d",
  });
};
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES || "30d",
  });
};
const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};
module.exports = {
  generateAccessToken,
  verifyToken,
  generateRefreshToken,
  verifyRefreshToken,
};
