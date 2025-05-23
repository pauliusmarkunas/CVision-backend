import { educationSchema } from "../../../schemas/userSchemas.js";

export const validateEducation = (req, res, next) => {
  const { error } = educationSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};
