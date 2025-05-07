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
      userTransactions: {
        include: {
          transaction: true,
        },
      },
    },
  });
};

const getAllUsers = async (queryParams) => {
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

module.exports = {
  createUser,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
};
