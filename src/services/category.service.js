const prisma = require("../prisma");

const getAllCategories = () => {
  const categories = prisma.category.findMany();
  return categories;
};
const createCategory = (data, userId) => {
  const category = prisma.category.create({
    data: {
      ...data,
      userId,
    },
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

const updateCategory = (id, data, userId) => {
  const category = prisma.category.update({
    where: {
      id: Number(id),
    },
    data: {
      ...data,
      userId,
    },
  });
  return category;
};

const deleteCategory = (id) => {
  const category = prisma.category.delete({
    where: {
      id: Number(id),
    },
  });
  return category;
};

module.exports = {
  getAllCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
};
