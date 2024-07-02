const prisma = require("../prisma");
const bcryptService = require("../services/bcrypt");
const createUser = (data) => {
  const user = prisma.user.create({
    data,
  });
  return user;
};
const getUser = (id) => {
  const user = prisma.user.findUnique({ where: { id } });
  return user;
};

const getAllUsers = () => {
  const users = prisma.user.findMany();
  return users;
};
const updateUser = async (id, data) => {
  if (data.password) {
    data.password = await bcryptService.hashPassword(data.password);
  }
  const user = prisma.user.update({ where: { id }, data });
  return user;
};

const deleteUser = (id) => {
  const user = prisma.user.delete({ where: { id } });
  return user;
};

module.exports = {
  createUser,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
};
