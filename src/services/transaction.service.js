const prisma = require("../prisma");
const AppError = require("../utils/appError");
const { getTimeRange } = require("../utils/timeRange");
const apiFeature = require("../utils/apiFeature");
const dayjs = require("dayjs");
const timezone = require("dayjs/plugin/timezone");
dayjs.extend(timezone);
const getAllTransactions = async (queryParams) => {
  const { where, orderBy, pagination } = apiFeature({
    queryParams,
    searchableFields: ["description"],
    defaultSort: {
      createdAt: "desc",
    },
  });
  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy,
      ...pagination,
    }),
    prisma.transaction.count({ where }),
  ]);

  return {
    transactions,
    total,
    page: parseInt(queryParams.page) || 1,
    limit: pagination.take || 10,
    totalPage: Math.ceil(total / pagination.take),
  };
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
const updateFund = async (fundId, categoryId, amount) => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });
  if (category.categoryType === "Income") {
    return await prisma.fund.update({
      where: { id: fundId },
      data: {
        balance: { increment: amount },
      },
    });
  } else {
    return await prisma.fund.update({
      where: { id: fundId },
      data: {
        balance: { decrement: amount },
      },
    });
  }
};
const createTransaction = async (data) => {
  const {
    userTransactions,
    categoryId,
    roomId,
    amount,
    userId,
    fundId,
    ...transactionData
  } = data;

  await validateCategory(categoryId);
  await validateRoomAccess(roomId, userId);

  const fund = await prisma.fund.findFirst({
    where: roomId ? { roomId } : { userId, roomId: null },
  });
  if (!fund) throw new AppError("Fund not found", 404);

  // if (fund.balance < amount) {
  //   throw new AppError("Insufficient fund balance", 400);
  // }

  const sharedAmount = Math.floor(amount / userTransactions.length);
  const newTransaction = await prisma.transaction.create({
    data: {
      categoryId,
      roomId,
      amount,
      userId,
      fundId: fund.id,
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

  await updateFund(
    newTransaction.fundId,
    newTransaction.categoryId,
    newTransaction.amount
  );
  const fullTransaction = await getTransaction(newTransaction.id);
  return fullTransaction;
};

const getTransaction = async (id) => {
  return await prisma.transaction.findUnique({
    where: {
      id,
    },
    include: {
      userTransactions: {
        select: {
          user: true,
        },
      },
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

const getStatistics = async (id, type) => {
  const { from, to } = getTimeRange(type);
  const transactions = await prisma.transaction.findMany({
    where: {
      ...id,
      createdAt: {
        gte: from,
        lte: to,
      },
    },
    include: {
      category: true,
    },
  });
  const byCategory = {};
  const byDay = {};
  let totalExpense = 0;
  let totalIncome = 0;
  let total = 0;

  transactions.forEach((tx) => {
    const day = dayjs(tx.createdAt).tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD");
    const name = tx.category?.name || "Unknown";
    const typeCategory = tx.category?.categoryType || "Unknown";
    if (!byDay[day]) {
      byDay[day] = {
        expense: 0,
        income: 0,
        total: 0,
        byCategory: {},
      };
    }

    if (typeCategory === "Expense") {
      if (!byCategory[name]) byCategory[name] = 0;
      byCategory[name] += parseFloat(tx.amount);

      byDay[day].expense += parseFloat(tx.amount);
      totalExpense += parseFloat(tx.amount);

      if (!byDay[day].byCategory[name]) byDay[day].byCategory[name] = 0;
      byDay[day].byCategory[name] += parseFloat(tx.amount);
    } else if (typeCategory === "Income") {
      if (!byCategory[name]) byCategory[name] = 0;
      byCategory[name] += parseFloat(tx.amount);

      byDay[day].income += parseFloat(tx.amount);
      totalIncome += parseFloat(tx.amount);

      if (!byDay[day].byCategory[name]) byDay[day].byCategory[name] = 0;
      byDay[day].byCategory[name] += parseFloat(tx.amount);
    }

    byDay[day].total += parseFloat(tx.amount);
  });

  return {
    type,
    from,
    to,
    total,
    byCategory,
    byDay,
    totalExpense,
    totalIncome,
  };
};

module.exports = {
  getAllTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getStatistics,
};
