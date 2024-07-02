const prisma = require("../prisma");

const createUser = (data) => {
  const user = prisma.user.create({
    data,
  });
  return user;
};

module.exports = {
  createUser,
};
