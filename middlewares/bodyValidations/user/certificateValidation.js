import { certificateSchema } from "../../../schemas/userSchemas.js";

export const validateCertificate = (req, res, next) => {
  const { error } = certificateSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};
