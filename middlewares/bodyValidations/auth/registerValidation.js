import registerSchema from "../../../schemas/registerSchema.js";

const registerValidation = (req, res, next) => {
  const { error } = registerSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      errors: error.details.map((err) => ({
        field: err.path[0],
        message: err.message,
      })),
    });
  }
  next();
};

export default registerValidation;
