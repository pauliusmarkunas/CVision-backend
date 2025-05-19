import express from "express";
import {
  getUserInfo,
  login,
  register,
  registerCodeValidation,
} from "../controllers/authController.js";
import registerValidation from "../middlewares/bodyValidations/auth/registerValidation.js";
import registerCodeValidationSchema from "../middlewares/bodyValidations/auth/registerCodeValidation.js";
import loginValidation from "../middlewares/bodyValidations/auth/loginValidation.js";
import { authUser } from "../middlewares/authUser.js";
// import loginValidation from "../middlewares/bodyValidations/auth/loginValidation.js";
// import { authUser } from "../middlewares/authUser.js";

const router = express.Router();

// register
router.post("/register", registerValidation, register);

router.post("/validate", registerCodeValidationSchema, registerCodeValidation);

router.post("/login", loginValidation, login);

router.get("/me", authUser, getUserInfo);

export default router;
