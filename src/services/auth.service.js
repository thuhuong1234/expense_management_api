const prisma = require("../prisma");
const bcryptService = require("../services/bcrypt");
const AppError = require("../utils/AppError");
const jwtService = require("../services/jwt.service");
const crypto = require("crypto");
const { saveRefreshToken } = require("../services/token.service");
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
  return user;
};
const refreshToken = async (user, res) => {
  const createRefreshToken = jwtService.generateRefreshToken(user);
  await saveRefreshToken(user, createRefreshToken);
  res.cookie("refreshToken", createRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000,
  });
};
const generateResetToken = async (user) => {
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  await prisma.token.create({
    data: {
      userId: user.id,
      token: hashedToken,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 phút
    },
  });
  return resetToken;
};
const resetPassword = async (token, password) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const tokenUser = await prisma.token.findFirst({
    where: {
      token: hashedToken,
      expiresAt: { gt: new Date() }, // expired at => sent mail again
    },
  });
  if (!tokenUser) {
    throw new AppError("Token is expired, send email again", 400);
  }
  const hashedPassword = await bcryptService.hashPassword(password);
  await prisma.user.update({
    where: { id: tokenUser.userId },
    data: { password: hashedPassword },
  });
  await prisma.token.delete({ where: { id: tokenUser.id } });
};
module.exports = {
  login,
  getUser,
  refreshToken,
  generateResetToken,
  resetPassword,
};
