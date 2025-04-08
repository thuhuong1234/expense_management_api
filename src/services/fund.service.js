const prisma = require("../prisma");
const AppError = require("../utils/appError");
const createFund = async (userId, data) => {
  const { name, roomId, description, balance } = data;
  let existingFund;
  if (roomId) {
    existingFund = await prisma.fund.findFirst({
      where: { roomId },
    });

    if (existingFund) {
      throw new AppError("Room already has a fund", 400);
    }

    return await prisma.fund.create({
      data: {
        name: name || `Quỹ phòng #${roomId}`,
        description,
        roomId,
        userId,
        balance,
      },
    });
  }
  const existingUserFund = await prisma.fund.findFirst({
    where: {
      userId,
      roomId: null,
    },
  });
  if (existingUserFund) {
    throw new AppError("You already have a personal fund", 400);
  }

  return await prisma.fund.create({
    data: {
      name: name || `Quỹ cá nhân của bạn`,
      description,
      userId,
    },
  });
};
module.exports = { createFund };
