const prisma = require("../prisma");
const bcryptService = require("../services/bcrypt");
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

const getAllUsers = () => {
  return (users = prisma.user.findMany());
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
