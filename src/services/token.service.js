const prisma = require("../prisma");
const saveRefreshToken = async (user, refreshToken) => {
  const token = await prisma.token.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });
  return token;
};
module.exports = { saveRefreshToken };
