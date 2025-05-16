import { eventSchema } from "../../../schemas/eventSchema.js";

const eventValidation = (req, res, next) => {
  const { error } = eventSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  next();
};

export default eventValidation;
