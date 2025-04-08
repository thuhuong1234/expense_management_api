const Joi = require("joi");
const {
  CREATE_USER_API_KEY,
  UPDATE_USER_API_KEY,
  CREATE_CATEGORY_API_KEY,
  UPDATE_CATEGORY_API_KEY,
  CREATE_ROOM_API_KEY,
  UPDATE_ROOM_API_KEY,
  CREATE_TRANSACTION_API_KEY,
  UPDATE_TRANSACTION_API_KEY,
  CREATE_FUND_API_KEY,
} = require("../constants");
const { join } = require("@prisma/client/runtime/library");
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
  [CREATE_ROOM_API_KEY]: Joi.object({
    name: Joi.string().min(3).max(45).required(),
    quality: Joi.number().integer().default(0).optional(),
    userId: Joi.number().optional(),
  }),
  [UPDATE_ROOM_API_KEY]: Joi.object({
    name: Joi.string().min(3).max(45).optional(),
    quality: Joi.number().integer().optional(),
    userId: Joi.number().optional(),
  }),
  [CREATE_TRANSACTION_API_KEY]: Joi.object({
    description: Joi.string().required(),
    amount: Joi.number().required(),
    categoryId: Joi.number().required(),
    roomId: Joi.number().required().optional(),
    userTransactions: Joi.array().items(Joi.number()).optional(),
    dueDate: Joi.date().optional(),
  }),
  [UPDATE_TRANSACTION_API_KEY]: Joi.object({
    description: Joi.string().optional(),
    amount: Joi.number().optional(),
    categoryId: Joi.number().optional(),
    roomId: Joi.number().optional(),
    userTransactions: Joi.array().items(Joi.number()).optional(),
    dueDate: Joi.date().optional(),
  }),
  [CREATE_FUND_API_KEY]: Joi.object({
    balance: Joi.number().required(),
    name: Joi.string().required().optional(),
    userId: Joi.number().optional(),
    roomId: Joi.number().optional(),
  }),
};
