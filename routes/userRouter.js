import express from "express";
import {
  getFullUserProfile,
  createUserProfile,
  updateUserProfile,
  addCertificate,
  updateCertificate,
  deleteCertificate,
  addEducation,
  updateEducation,
  deleteEducation,
  addExperience,
  updateExperience,
  deleteExperience,
  getUserCV,
  uploadUserCV,
  updateUserCV,
  deleteUserCV,
} from "../controllers/userController.js";
import { authUser } from "../middlewares/authUser.js";
import { validateProfile } from "../middlewares/bodyValidations/user/profileValidation.js";
import { validateCertificate } from "../middlewares/bodyValidations/user/certificateValidation.js";
import { validateEducation } from "../middlewares/bodyValidations/user/educationValidation.js";
import { validateExperience } from "../middlewares/bodyValidations/user/experienceValidation.js";

const router = express.Router();

// Apply authentication middleware to all user routes
router.use(authUser);

// User profile routes
router.get("/full-profile", getFullUserProfile);
router.post("/profile", validateProfile, createUserProfile);
router.put("/profile", validateProfile, updateUserProfile);

// Certificate routes
router.post("/certificate", validateCertificate, addCertificate);
router.put("/certificate/:id", validateCertificate, updateCertificate);
router.delete("/certificate/:id", deleteCertificate);

// Education routes
router.post("/education", validateEducation, addEducation);
router.put("/education/:id", validateEducation, updateEducation);
router.delete("/education/:id", deleteEducation);

// Experience routes
router.post("/experience", validateExperience, addExperience);
router.put("/experience/:id", validateExperience, updateExperience);
router.delete("/experience/:id", deleteExperience);

// CV routes (dar nepadaryta)
router.get("/cv", getUserCV);
router.post("/cv", uploadUserCV);
router.put("/cv/:id", updateUserCV);
router.delete("/cv/:id", deleteUserCV);

export default router;
