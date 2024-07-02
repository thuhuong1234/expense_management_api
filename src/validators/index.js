const Joi = require("joi");
const { CREATE_USER_API_KEY, UPDATE_USER_API_KEY } = require("../constants");
module.exports = {
  [CREATE_USER_API_KEY]: Joi.object({
    name: Joi.string().min(3).max(55).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(8)
      .max(16)
      .pattern(new RegExp("^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])")),
  }),

  [UPDATE_USER_API_KEY]: Joi.object({
    name: Joi.string().min(3).max(55),
    email: Joi.string().email(),
    password: Joi.string()
      .min(8)
      .max(16)
      .pattern(new RegExp("^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])")),
  }),
};
