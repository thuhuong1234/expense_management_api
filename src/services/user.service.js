const prisma = require("../prisma");
const bcryptService = require("../services/bcrypt");
const apiFeature = require("../utils/apiFeature");
const createUser = (data) => {
  return (user = prisma.user.create({
    data,
  }));
};
const getUser = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      rooms: true,
      fund: true,
      userTransactions: {
        include: {
          transaction: true,
        },
      },
    },
  });
};

const getAllUsers = async (queryParams) => {
  if (queryParams.all) {
    const users = await prisma.user.findMany();
    return { users };
  }
  const { where, orderBy, pagination } = apiFeature({
    queryParams,
    searchableFields: ["name", "email", "phone"],
    defaultSort: {
      createdAt: "desc",
    },
  });
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy,
      ...pagination,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    total,
    page: parseInt(queryParams.page) || 1,
    limit: pagination.take || 10,
    totalPage: Math.ceil(total / pagination.take),
  };
};
const updateUser = async (id, data) => {
  if (data.password) {
    data.password = await bcryptService.hashPassword(data.password);
  }
  return (user = prisma.user.update({ where: { id }, data }));
};

const deleteUser = async (id) => {
  return await prisma.user.delete({ where: { id } });
};
const getCountByUserId = async (userId) => {
  const transactions = await prisma.userTransaction.findMany({
    where: {
      userId,
    },
    include: {
      transaction: {
        include: {
          category: true,
          room: true,
          fund: true,
        },
      },
    },
  });
  let totalIncome = 0;
  let totalExpense = 0;
  transactions.forEach((transaction) => {
    const amount = Number(transaction.amount);
    const type = transaction.transaction.category?.categoryType;
    if (type === "Income") totalIncome += amount;
    else if (type === "Expense") totalExpense += amount;
  });

  return { totalIncome, totalExpense };
};
module.exports = {
  createUser,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getCountByUserId,
};
