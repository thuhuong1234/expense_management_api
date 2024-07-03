const prima = require("../prisma");
const bcryptService = require("../services/bcrypt");
const AppError = require("../utils/AppError");
const login = async (email, password) => {
  const user = await prima.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError("Email not found", 404);
  }
  const isMatch = await bcryptService.comparePassword(password, user.password);
  if (!isMatch) {
    throw new AppError("Wrong password", 400);
  }

  return user;
};
module.exports = {
  login,
};
