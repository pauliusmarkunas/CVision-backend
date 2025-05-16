import registerCodeValidationSchema from "../../../schemas/registerCodeValidationSchema.js";

const registerCodeValidation = (req, res, next) => {
  const { error } = registerCodeValidationSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res
      .status(400)
      .json({ errpr: error.details.map((detail) => detail.message) });
  }

  next();
};

export default registerCodeValidation;
