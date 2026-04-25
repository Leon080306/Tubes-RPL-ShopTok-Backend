import { Router } from "express";
import { ChatController } from "../controllers/chat.controller";

const router: Router = Router();

// Customer: get all sessions
router.get("/", ChatController.getSessions);

// Seller: get all sessions for their shop
router.get("/shop", ChatController.getShopSessions);

// Get messages for a specific conversation
router.get("/:shopId", ChatController.getMessages);

// Customer sends message
router.post("/", ChatController.sendMessage);

// Seller sends message
router.post("/seller", ChatController.sellerSendMessage);

export default router;