import { Request, Response } from "express";
import { Chats } from "../models/Chats";
import { Shops } from "../models/Shops";
import { Op } from "sequelize";

export class ChatController {

    /**
     * GET /chats?user_id=xxx
     * Customer: get all chat sessions grouped by shop
     */
    static async getSessions(req: Request, res: Response) {
        try {
            const user_id = req.query.user_id as string;

            if (!user_id) {
                return res.status(400).json({ message: "user_id wajib diisi" });
            }

            const chats = await Chats.findAll({
                where: { user_id },
                include: [
                    { model: Shops, attributes: ["shop_id", "name", "profile_pic"] },
                ],
                order: [["createdAt", "ASC"]],
                raw: false,
            });

            // Group by shop
            const sessionMap = new Map<string, {
                shop_id: string;
                shop_name: string;
                last_message: string;
                unread_count: number;
                messages: {
                    chat_id: string;
                    sender_role: string;
                    message: string;
                    created_at: string;
                }[];
            }>();

            for (const chat of chats) {
                const plain = chat.toJSON() as any;
                const shopId = plain.shop_id;

                if (!sessionMap.has(shopId)) {
                    sessionMap.set(shopId, {
                        shop_id: shopId,
                        shop_name: plain.shop?.name ?? "Toko",
                        last_message: "",
                        unread_count: 0,
                        messages: [],
                    });
                }

                const session = sessionMap.get(shopId)!;

                session.messages.push({
                    chat_id: plain.chat_id,
                    sender_role: plain.sender_role,
                    message: plain.message,
                    created_at: plain.createdAt,
                });

                session.last_message = plain.message;
            }

            res.json({ records: Array.from(sessionMap.values()) });
        } catch (error: any) {
            console.error("GET SESSIONS ERROR:", error);
            res.status(500).json({ message: error.message });
        }
    }

    /**
     * GET /chats/shop?shop_id=xxx
     * Seller: get all chat sessions grouped by customer
     */
    static async getShopSessions(req: Request, res: Response) {
        try {
            const shop_id = req.query.shop_id as string;
            const seller_id = req.query.seller_id as string;

            if (!shop_id || !seller_id) {
                return res.status(400).json({ message: "shop_id dan seller_id wajib diisi" });
            }

            // Verify shop belongs to seller
            const shop = await Shops.findOne({ where: { shop_id, owner_id: seller_id } });
            if (!shop) {
                return res.status(403).json({ message: "Bukan toko kamu" });
            }

            const chats = await Chats.findAll({
                where: { shop_id },
                include: [
                    {
                        model: Shops,
                        attributes: ["shop_id", "name"],
                    },
                ],
                order: [["createdAt", "ASC"]],
                raw: false,
            });

            // We need user info — fetch separately to avoid include issues
            const userIds = [...new Set(chats.map((c) => c.toJSON().user_id as string))];

            const { Users } = require("../models/Users");
            const users = await Users.findAll({
                where: { user_id: { [Op.in]: userIds } },
                attributes: ["user_id", "first_name", "last_name", "profile_pic"],
                raw: true,
            });

            const userMap = new Map(users.map((u: any) => [u.user_id, u]));

            // Group by user_id
            const sessionMap = new Map<string, {
                user_id: string;
                customer_name: string;
                customer_pic: string;
                shop_id: string;
                last_message: string;
                unread_count: number;
                messages: {
                    chat_id: string;
                    sender_role: string;
                    message: string;
                    created_at: string;
                }[];
            }>();

            for (const chat of chats) {
                const plain = chat.toJSON() as any;
                const userId = plain.user_id;
                const user = userMap.get(userId) as any;

                if (!sessionMap.has(userId)) {
                    sessionMap.set(userId, {
                        user_id: userId,
                        customer_name: user
                            ? `${user.first_name} ${user.last_name}`
                            : "Customer",
                        customer_pic: user?.profile_pic ?? "",
                        shop_id: plain.shop_id,
                        last_message: "",
                        unread_count: 0,
                        messages: [],
                    });
                }

                const session = sessionMap.get(userId)!;

                session.messages.push({
                    chat_id: plain.chat_id,
                    sender_role: plain.sender_role,
                    message: plain.message,
                    created_at: plain.createdAt,
                });

                session.last_message = plain.message;
            }

            res.json({ records: Array.from(sessionMap.values()) });
        } catch (error: any) {
            console.error("GET SHOP SESSIONS ERROR:", error);
            res.status(500).json({ message: error.message });
        }
    }

    /**
     * GET /chats/:shopId?user_id=xxx
     * Get messages for a specific customer-shop conversation
     */
    static async getMessages(req: Request, res: Response) {
        try {
            const user_id = req.query.user_id as string;
            const { shopId } = req.params;

            if (!user_id) {
                return res.status(400).json({ message: "user_id wajib diisi" });
            }

            const messages = await Chats.findAll({
                where: { user_id, shop_id: shopId },
                order: [["createdAt", "ASC"]],
                raw: true,
            });

            const result = messages.map((chat: any) => ({
                chat_id: chat.chat_id,
                sender_role: chat.sender_role,
                message: chat.message,
                created_at: chat.createdAt,
            }));

            res.json({ records: result });
        } catch (error: any) {
            console.error("GET MESSAGES ERROR:", error);
            res.status(500).json({ message: error.message });
        }
    }

    /**
     * POST /chats
     * Send a message (from customer or seller)
     *
     * Body: { user_id, shop_id, message, sender_role? }
     *
     * - Customer sends: sender_role = "customer" (default)
     * - Seller sends:   sender_role = "seller", user_id = the customer's user_id
     */
    static async sendMessage(req: Request, res: Response) {
        try {
            const { user_id, shop_id, message, sender_role } = req.body;

            if (!user_id || !shop_id || !message?.trim()) {
                return res.status(400).json({
                    message: "user_id, shop_id, dan message wajib diisi",
                });
            }

            const shop = await Shops.findByPk(shop_id);
            if (!shop) {
                return res.status(404).json({ message: "Toko tidak ditemukan" });
            }

            const role = sender_role === "seller" ? "seller" : "customer";

            const chat = await Chats.create({
                user_id,
                shop_id,
                message: message.trim(),
                sender_role: role,
            });

            res.status(201).json({
                chat_id: chat.chat_id,
                sender_role: role,
                message: chat.message,
                created_at: chat.createdAt,
            });
        } catch (error: any) {
            console.error("SEND MESSAGE ERROR:", error);
            res.status(500).json({ message: error.message });
        }
    }

    /**
     * POST /chats/seller
     * Seller sends a message to a customer
     *
     * Body: { seller_id, shop_id, user_id (customer), message }
     */
    static async sellerSendMessage(req: Request, res: Response) {
        try {
            const { seller_id, shop_id, user_id, message } = req.body;

            if (!seller_id || !shop_id || !user_id || !message?.trim()) {
                return res.status(400).json({
                    message: "seller_id, shop_id, user_id, dan message wajib diisi",
                });
            }

            // Verify shop belongs to seller
            const shop = await Shops.findOne({ where: { shop_id, owner_id: seller_id } });
            if (!shop) {
                return res.status(403).json({ message: "Bukan toko kamu" });
            }

            const chat = await Chats.create({
                user_id,     // the customer
                shop_id,
                message: message.trim(),
                sender_role: "seller",
            });

            res.status(201).json({
                chat_id: chat.chat_id,
                sender_role: "seller",
                message: chat.message,
                created_at: chat.createdAt,
            });
        } catch (error: any) {
            console.error("SELLER SEND MESSAGE ERROR:", error);
            res.status(500).json({ message: error.message });
        }
    }
}