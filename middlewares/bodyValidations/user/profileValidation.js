import { profileSchema } from "../../../schemas/userSchemas.js";

export const validateProfile = (req, res, next) => {
  const { error } = profileSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};
