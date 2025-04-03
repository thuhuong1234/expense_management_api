const Joi = require("joi");
const {
  CREATE_USER_API_KEY,
  UPDATE_USER_API_KEY,
  CREATE_CATEGORY_API_KEY,
  UPDATE_CATEGORY_API_KEY,
} = require("../constants");
module.exports = {
  [CREATE_USER_API_KEY]: Joi.object({
    name: Joi.string().min(3).max(55).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(8)
      .max(16)
      .required()
      .pattern(new RegExp("^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])")),
    phone: Joi.string().min(10).max(10).required(),
  }),

  [UPDATE_USER_API_KEY]: Joi.object({
    name: Joi.string().min(3).max(55).optional(),
    email: Joi.string().email().optional(),
    password: Joi.string()
      .min(8)
      .max(16)
      .pattern(new RegExp("^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
      .optional(),
    phone: Joi.string().min(10).max(10).optional(),
  }),

  [CREATE_CATEGORY_API_KEY]: Joi.object({
    name: Joi.string().min(3).max(45).required(),
    categoryType: Joi.string()
      .valid("Expense", "Income", "Undefined")
      .optional(),
    userId: Joi.number().optional(),
    avatarUrl: Joi.string().optional(),
  }),

  [UPDATE_CATEGORY_API_KEY]: Joi.object({
    name: Joi.string().min(3).max(45).optional(),
    categoryType: Joi.string()
      .valid("Expense", "Income", "Undefined")
      .optional(),
    userId: Joi.number().optional(),
    avatarUrl: Joi.string().optional(),
  }),
};
