const prisma = require("../prisma");

const createCategory = (data) => {
  const category = prisma.category.create({
    data,
  });
  return category;
};

module.exports = {
  createCategory,
};
