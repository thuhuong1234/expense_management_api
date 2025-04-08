const prisma = require("../prisma");

const createFund = async (data) => {
  const { name, userId, roomId, description } = data;
  const existingFund = await prisma.fund.findFirst({
    where: {
      OR: [{ userId: userId || undefined }, { roomId: roomId || undefined }],
    },
  });
  if (existingFund) {
    throw new Error("Fund already exists");
  }

  return await prisma.fund.create({ data });
};
//nạp tiền, validate, controller,
module.exports = { createFund };
