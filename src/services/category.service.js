const prisma = require("../prisma");

const getAllCategories = () => {
  const categories = prisma.category.findMany({
    // skip: 10,
    // take: 10,
    // where: {
    //   name: {
    //     contains: "Prisma",
    //   },
    // },
    orderBy: {
      categoryType: "desc",
    },
  });
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
      id,
    },
  });
  return category;
};

const updateCategory = (id, data, userId) => {
  const category = prisma.category.update({
    where: {
      id,
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
    where: { id },
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
