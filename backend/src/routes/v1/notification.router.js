import express from "express";
const router = express.Router();

import { verifyToken } from "../../middlewares/index.js";
import { validate } from "../../middlewares/index.js";
import { notificationParams } from "../../schemas/index.js";
import * as notificationController from "../../controllers/notification/index.js";

router.use(verifyToken);

router.get("/", notificationController.getNotifications);
router.post(
  "/:id/view",
  validate({ params: notificationParams }),
  notificationController.markAsViewed
);

router.post("/visit", notificationController.markAsVisited);

export default router;
