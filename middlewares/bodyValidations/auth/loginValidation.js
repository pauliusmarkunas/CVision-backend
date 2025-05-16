import loginSchema from "../../../schemas/loginSchema.js";

const loginValidation = (req, res, next) => {
  const { error } = loginSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  next();
};

export default loginValidation;
