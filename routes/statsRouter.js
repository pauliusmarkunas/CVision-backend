import express from "express";
import {
  getEventsStats,
  getOrganizersStats,
} from "../controllers/statsController.js";

const router = express.Router();

router.get("/events", getEventsStats);

router.get("/organizers", getOrganizersStats);

export default router;
