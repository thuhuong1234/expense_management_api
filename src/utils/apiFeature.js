const apiFeature = ({
  queryParams,
  searchableFields = [],
  defaultSort = { createdAt: "desc" },
}) => {
  const { page = 1, limit = 10, search, sort, ...filters } = queryParams;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit) || 10;
  const where = {};

  if (search && searchableFields.length > 0) {
    where.OR = searchableFields.map((field) => ({
      [field]: {
        contains: search,
      },
    }));
  }

  if (Object.keys(filters).length > 0) {
    where.AND = Object.keys(filters).map((key) => ({
      [key]: filters[key],
    }));
  }

  let orderBy = defaultSort;
  if (sort) {
    const [field, order = "asc"] = sort.split(":");
    orderBy[field] = order;
  }
  return {
    pagination: { skip, take },
    where,
    orderBy,
  };
};
module.exports = apiFeature;
