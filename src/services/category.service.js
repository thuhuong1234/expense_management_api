const prisma = require("../prisma");
const apiFeature = require("../utils/apiFeature");
const getAllCategories = async (queryParams) => {
  const { where, orderBy, pagination } = apiFeature({
    queryParams,
    searchableFields: ["name"],
    defaultSort: {
      createdAt: "desc",
    },
  });
  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      where,
      orderBy,
      ...pagination,
    }),
    prisma.category.count({ where }),
  ]);

  return {
    categories,
    total,
    page: parseInt(queryParams.page) || 1,
    limit: pagination.take || 10,
    totalPage: Math.ceil(total / pagination.take),
  };
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
