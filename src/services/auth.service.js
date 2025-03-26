const prisma = require("../prisma");
const bcryptService = require("../services/bcrypt");
const AppError = require("../utils/AppError");
const login = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError("Email not found", 404);
  }
  const isMatch = await bcryptService.comparePassword(password, user.password);
  if (!isMatch) {
    throw new AppError("Wrong password", 400);
  }

  return user;
};
const getUser = async (id) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
};
module.exports = {
  login,
  getUser,
};
