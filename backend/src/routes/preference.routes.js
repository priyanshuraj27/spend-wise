import { Router } from "express";
import {
  savePreference,
  getUserPrefs,
  searchPreferences,
  deletePreference,
} from "../controllers/preference.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Apply authentication middleware to all routes
router.use(verifyJWT);

// Preference management routes
router.post("/save", savePreference);
router.get("/", getUserPrefs);
router.get("/search", searchPreferences);
router.delete("/:id", deletePreference);

export default router;
