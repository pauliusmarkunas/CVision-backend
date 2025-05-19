import pool from "../utils/pgConnection.js";
import { encryptPassword, checkPassword } from "../utils/passwordCrypt.js";
import { generateJwtToken } from "../utils/generateJwt.js";
import dotenv from "dotenv";
import EmailService from "../services/emailService.js";
import registerValidationHtmlTemplate from "../htmlTemplates/registerValidationEmail.js";
import { redisClient } from "../utils/redisConnection.js";
dotenv.config();
const IS_PRODUCTION = JSON.parse(process.env.IS_PRODUCTION);

export async function register(req, res) {
  const { email, password } = req.body;

  try {
    // checks if email already in use
    const userExist = await pool.query("select * from users where email = $1", [
      email,
    ]);

    if (userExist.rowCount > 0) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await encryptPassword(password);

    // generate random code for validation
    const validationCode = Math.floor(100000 + Math.random() * 900000);

    //send email with validation code
    const emailService = new EmailService();
    const emailResult = await emailService.sendMail({
      to: email,
      subject: "CVision - Validation Code",
      text: `Your validation code is ${validationCode}`,
      html: registerValidationHtmlTemplate(validationCode),
    });

    if (!emailResult.success) {
      return res
        .status(500)
        .json({ message: "Failed to send validation email" });
    }

    // save validation code to redis
    const redisResponse = await redisClient.set(
      email,
      JSON.stringify({ validationCode, hashedPassword }),

      "EX",
      15 * 60 // EXpire after 15 minutes
    );

    if (!redisResponse) {
      return res
        .status(500)
        .json({ message: "Failed to cache validation code" });
    }

    res.status(200).json({
      message: "Validation code sent to email",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: `Internal Server Error`, error: error.message });
  }
}

export async function registerCodeValidation(req, res) {
  const { validationCode, email } = req.body;

  try {
    // check if validation code is correct
    const redisData = await redisClient.get(email);

    if (!redisData) {
      return res.status(400).json({ message: "Validation code expired" });
    }

    const { validationCode: storedCode, hashedPassword } =
      JSON.parse(redisData);

    const isCodeCorrect = String(storedCode) === validationCode;
    console.log(storedCode, validationCode);

    if (!isCodeCorrect) {
      return res.status(400).json({ message: "Incorrect validation code" });
    }

    // save user data to database
    const result = await pool.query(
      "insert into users (email, password_hash) values ($1, $2)",
      [email, hashedPassword]
    );

    if (result.rowCount > 0) {
      res.status(200).json({
        message: "Organizer created successfully",
        result: result.rows[0],
      });
    }

    // create jwt token and refresh cookie after successful registration
  } catch (error) {
    res.status(500).json({
      message: `Internal Server Error`,
      error: error.message,
    });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await pool.query(
      "select * from users where email = $1 and deleted_at IS NULL",
      [email]
    );

    if (user.rowCount === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const userData = user.rows[0];

    const isPasswordCorrect = await checkPassword(
      password,
      userData.password_hash
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 2nd argument - JWT secret used: "session"(default) or "refresh"
    const sessionToken = generateJwtToken(userData);
    const refreshToken = generateJwtToken(userData, "refresh");

    // set refresh token in cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: IS_PRODUCTION,
      sameSite: IS_PRODUCTION ? "none" : "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(200).json({ message: "Login successful", sessionToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export function getUserInfo(req, res) {
  res.status(200).json(req.user);
}

// after MVP add remind of password
