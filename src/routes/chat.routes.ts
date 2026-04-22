// chat.router.ts
import { Router } from "express";
import { ChatController } from "../controllers/chat.controller";

const router: Router = Router();

router.get("/", ChatController.getSessions);
router.get("/:shopId", ChatController.getMessages);
router.post("/", ChatController.sendMessage);

export default router;