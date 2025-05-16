import Joi from "joi";

const validationSchema = Joi.object({
  email: Joi.string().email().required(),
  validationCode: Joi.string()
    .pattern(/^\d{6}$/)
    .required()
    .messages({
      "string.pattern.base": "Validation code must be a 6-digit number",
    }),
});

export default validationSchema;
