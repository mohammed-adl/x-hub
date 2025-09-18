import express from "express";
const router = express.Router();

import { verifyToken } from "../../middlewares/index.js";
import * as searchController from "../../controllers/search/index.js";

router.use(verifyToken);
router.get("/", searchController.searchUsers); // TODO adjust user to genral searching

export default router;
