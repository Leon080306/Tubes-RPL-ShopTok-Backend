// chat.controller.ts
import { Request, Response } from "express";
import { Chats } from "../models/Chats";
import { Shops } from "../models/Shops";
import { Users } from "../models/Users";

export class ChatController {

    // GET /api/chats — semua session milik user yang login
    static async getSessions(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.user_id;

            const chats = await Chats.findAll({
                where: { user_id: userId },
                include: [
                    { model: Shops, attributes: ["shop_id", "shop_name"] },
                    { model: Users, attributes: ["role"] },
                ],
                order: [["createdAt", "ASC"]],
            });

            // group by shop_id
            const sessionMap = new Map<string, any>();

            for (const chat of chats) {
                const shopId = chat.shop_id;
                const shop = (chat as any).shop;

                if (!sessionMap.has(shopId)) {
                    sessionMap.set(shopId, {
                        shop_id: shopId,
                        shop_name: shop?.shop_name ?? "Toko",
                        last_message: "",
                        unread_count: 0,
                        messages: [],
                    });
                }

                const session = sessionMap.get(shopId);
                const user = (chat as any).user;

                session.messages.push({
                    chat_id: chat.chat_id,
                    sender_role: user?.role ?? "customer",
                    message: chat.message,
                    created_at: chat.createdAt,
                });

                session.last_message = chat.message;
            }

            res.status(200).json({ records: Array.from(sessionMap.values()) });
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }

    // GET /api/chats/:shopId — pesan dalam satu session
    static async getMessages(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.user_id;
            const { shopId } = req.params;

            const messages = await Chats.findAll({
                where: { user_id: userId, shop_id: shopId },
                include: [{ model: Users, attributes: ["role"] }],
                order: [["createdAt", "ASC"]],
            });

            const result = messages.map((chat) => ({
                chat_id: chat.chat_id,
                sender_role: (chat as any).user?.role ?? "customer",
                message: chat.message,
                created_at: chat.createdAt,
            }));

            res.status(200).json({ records: result });
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }

    // POST /api/chats — kirim pesan
    static async sendMessage(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.user_id;
            const { shop_id, message } = req.body;

            if (!shop_id || !message?.trim()) {
                res.status(400).json({ message: "shop_id dan message wajib diisi" });
                return;
            }

            const shop = await Shops.findByPk(shop_id);
            if (!shop) {
                res.status(404).json({ message: "Toko tidak ditemukan" });
                return;
            }

            const chat = await Chats.create({ user_id: userId, shop_id, message });

            res.status(201).json(chat);
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }
}