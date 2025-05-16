import { guestSchema } from "../../../schemas/guestSchema.js";

const guestValidation = async (req, res, next) => {
  const { error } = guestSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  next();
};

export default guestValidation;
