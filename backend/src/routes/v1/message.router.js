import express from "express";
const router = express.Router();

import { verifyToken, validate } from "../../middlewares/index.js";
import {
  messageSchema,
  chatSchema,
  paramsSchema,
} from "../../schemas/message.schema.js";
import * as messageController from "../../controllers/message/index.js";

router.use(verifyToken);

router.get("/", messageController.getAllConversations);

router.get(
  "/:id",
  validate({ params: paramsSchema, query: chatSchema }),
  messageController.getChat
);

router.post(
  "/:id",
  validate({ params: paramsSchema, body: messageSchema }),
  messageController.sendMessage
);

export default router;
