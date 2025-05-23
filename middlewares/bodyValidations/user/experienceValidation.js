import { experienceSchema } from "../../../schemas/userSchemas.js";

export const validateExperience = (req, res, next) => {
  const { error } = experienceSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};
