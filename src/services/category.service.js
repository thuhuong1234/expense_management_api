const prisma = require("../prisma");

const createCategory = (data) => {
  const category = prisma.category.create({
    data,
  });
  return category;
};

const getCategory = (id) => {
  const category = prisma.category.findUnique({
    where: {
      id: Number(id),
    },
  });
  return category;
};

const updateCategory = (id, data) => {
  const category = prisma.category.update({
    where: {
      id: Number(id),
    },
    data,
  });
  return category;
};
module.exports = {
  createCategory,
  getCategory,
  updateCategory,
};
