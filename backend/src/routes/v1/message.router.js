import express from "express";
const router = express.Router();

import { verifyToken, validate } from "../../middlewares/index.js";
import { messageSchema, paramsSchema } from "../../schemas/message.schema.js";
import * as messageController from "../../controllers/message/index.js";

router.use(verifyToken);

router.get("/", messageController.getAllConversations);

router.post("/", messageController.createChat);

router.get("/:chatId", messageController.getChat);

router.post("/visited", messageController.markMessagesAsVisited);
router.post("/:chatId/read", messageController.markMessagesAsRead);

router.post("/:id", messageController.sendMessage);

export default router;
