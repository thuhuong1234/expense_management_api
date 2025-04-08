const prisma = require("../prisma");
const AppError = require("../utils/AppError");

const getAllTransactions = () => {
  const transactions = prisma.transaction.findMany();
  return transactions;
};
const validateCategory = async (categoryId) => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });
  if (!category) throw new AppError("Category not found", 404);
  return category;
};
const validateRoomAccess = async (roomId, userId) => {
  if (!roomId) return true;
  const room = await prisma.userRoom.findFirst({ where: { roomId, userId } });
  if (!room) throw new AppError("Room not found or access denied", 403);
  return room;
};
const deductFromFund = async (fundId, amount) => {
  await prisma.fund.update({
    where: { id: fundId },
    data: {
      balance: {
        decrement: amount,
      },
    },
  });
};
const createTransaction = async (data) => {
  const {
    userTransactions,
    categoryId,
    roomId,
    amount,
    userId,
    ...transactionData
  } = data;

  await validateCategory(categoryId);
  await validateRoomAccess(roomId, userId);

  const fund = await prisma.fund.findFirst({
    where: roomId ? { roomId } : { userId, roomId: null },
  });
  if (!fund) throw new AppError("Fund not found", 404);

  if (fund.balance < amount) {
    throw new AppError("Insufficient fund balance", 400);
  }

  const sharedAmount = Math.floor(amount / userTransactions.length);
  const newTransaction = await prisma.transaction.create({
    data: {
      categoryId,
      roomId,
      amount,
      userId,
      ...transactionData,
    },
  });

  const userTransactionData = userTransactions.map((pid) => ({
    userId: pid,
    transactionId: newTransaction.id,
    roomId: newTransaction.roomId,
    amount: sharedAmount,
  }));

  await prisma.userTransaction.createMany({
    data: userTransactionData,
  });
  await deductFromFund(fund.id, amount);
  const fullTransaction = await getTransaction(newTransaction.id);
  return fullTransaction;
};

const getTransaction = async (id) => {
  return await prisma.transaction.findUnique({
    where: {
      id,
    },
    include: {
      userTransactions: true,
    },
  });
};

const updateTransaction = (id, data) => {
  const transaction = prisma.transaction.update({
    where: {
      id: Number(id),
    },
    data,
  });
  return transaction;
};

const deleteTransaction = (id) => {
  const transaction = prisma.transaction.delete({
    where: {
      id: Number(id),
    },
  });
  return transaction;
};

module.exports = {
  getAllTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
