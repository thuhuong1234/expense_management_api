const apiValidator = require("../validators");
const Joi = require("joi");

const validationHandler = (req, res, next) => {
  const apiKey = `${req.method}_${req.originalUrl}`;

  let validationSchema;
  for (let [key, value] of Object.entries(apiValidator)) {
    if (new RegExp(key).test(apiKey)) {
      validationSchema = value;
      break;
    }
  }
  if (validationSchema) {
    const { error } = validationSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ error: error.details[0].message.replace(/"/g, "") });
    }
  }

  next();
};
module.exports = validationHandler;
