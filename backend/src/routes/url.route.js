import express from "express";
import { protectRoute } from "../middlewares/protectRoute.middleware.js";
import {
  createShortUrl,
  deleteShortCode,
  getAllShortCodes,
  redirectingToUrl,
} from "../controllers/url.controller.js";

const router = express.Router();

router.post("/shorten", protectRoute, createShortUrl);
router.get("/urls", protectRoute, getAllShortCodes);
router.delete("/urls/:id", protectRoute, deleteShortCode)

router.get("/:shortCode", redirectingToUrl);

export default router;
