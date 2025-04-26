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
      name: name || ` Quỹ cá nhân ${userId}.`,
      description,
      userId,
    },
  });
};
const getFund = async (id) => {
  const fund = await prisma.fund.findUnique({
    where: { id },
  });
  return fund;
};
const updateFund = async (id, userId, data) => {
  const user = await prisma.userRoom.findFirst({
    where: { userId, roomId: data.roomId },
  });
  if (!user.isLeader) throw new AppError(" You do not have permission.", 403);
  return await prisma.fund.update({
    where: { id },
    data,
  });
};
const deleteFund = async (id) => {
  return await prisma.fund.delete({ where: { id } });
};

module.exports = { createFund, getFund, updateFund, deleteFund };
