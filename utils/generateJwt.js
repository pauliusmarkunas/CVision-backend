import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const { JWT_SESSION_SECRET, JWT_REFRESH_SECRET } = process.env;

export function generateJwtToken(user, secretType = "session") {
  const { email, id } = user;
  // console.log({ first_name, last_name, email, id });
  return `Bearer ${jwt.sign(
    { email, id },
    secretType === "session" ? JWT_SESSION_SECRET : JWT_REFRESH_SECRET,
    {
      expiresIn: secretType === "session" ? "30min" : "30d",
    }
  )}`;
}
