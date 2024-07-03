const jwt = require("jsonwebtoken");
const accessToken = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });

  return token;
};
module.exports = { accessToken };
