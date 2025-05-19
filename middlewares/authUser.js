import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const { JWT_SESSION_SECRET, JWT_REFRESH_SECRET } = process.env;

export function authUser(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SESSION_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res
        .status(401)
        .json({ message: "Unauthorized, no refresh token" });
    }

    try {
      const refreshDecoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

      if (refreshDecoded) {
        const newSessionToken = generateJwtToken(refreshDecoded);

        // Set the new session token in the response header (need to intercept response in frontend)
        res.setHeader("Authorization", newSessionToken);
        req.user = refreshDecoded;
        return next();
      }
    } catch (error) {
      return res.status(401).json({ message: "session token refresh error" });
    }
    return res.status(401).json({ message: "session token error" });
  }
}
