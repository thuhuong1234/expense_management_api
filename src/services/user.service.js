const prisma = require("../prisma");
const bcryptService = require("../services/bcrypt");
const createUser = (data) => {
  return (user = prisma.user.create({
    data,
  }));
};
const getUser = (id) => {
  return (user = prisma.user.findUnique({
    where: { id },
    include: {
      todos: {
        select: {
          name: true,
          amountOfMoney: true,
        },
      },
    },
  }));
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

const deleteUser = (id) => {
  return (user = prisma.user.delete({ where: { id } }));
};

module.exports = {
  createUser,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
};
