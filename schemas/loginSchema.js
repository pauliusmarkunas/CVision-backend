import Joi from "joi";

const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .max(100)
    .required(),

  password: Joi.string().min(1).required(),
});

export default loginSchema;
