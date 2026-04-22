// chat.controller.ts
import { Request, Response } from "express";
import { Chats } from "../models/Chats";
import { Shops } from "../models/Shops";
import { Users } from "../models/Users";

export class ChatController {
    // chat.controller.ts — tambahkan dua method ini

    static async getSessions(req: Request, res: Response) {
        try {
            const { user_id } = req.query; // ← body → query

            if (!user_id) {
                res.status(400).json({ message: "user_id wajib diisi" });
                return;
            }

            const chats = await Chats.findAll({
                where: { user_id: user_id as string }, // ← cast string
                include: [
                    { model: Shops, attributes: ["shop_id", "name"] },
                    { model: Users, attributes: ["role"] },
                ],
                order: [["createdAt", "ASC"]],
            });

            const sessionMap = new Map<string, any>();

            for (const chat of chats) {
                const shopId = chat.shop_id;
                const shop = (chat as any).shop;

                if (!sessionMap.has(shopId)) {
                    sessionMap.set(shopId, {
                        shop_id: shopId,
                        shop_name: shop?.name ?? "Toko",
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

    static async getMessages(req: Request, res: Response) {
        try {
            const { user_id } = req.query; // ← body → query
            const { shopId } = req.params;

            const messages = await Chats.findAll({
                where: { user_id: user_id as string, shop_id: shopId }, // ← cast string
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

    static async sendMessage(req: Request, res: Response) {
        try {
            const { user_id, shop_id, message } = req.body;

            if (!user_id || !shop_id || !message?.trim()) {
                res.status(400).json({ message: "user_id, shop_id, dan message wajib diisi" });
                return;
            }

            const shop = await Shops.findByPk(shop_id);
            if (!shop) {
                res.status(404).json({ message: "Toko tidak ditemukan" });
                return;
            }

            const chat = await Chats.create({ user_id, shop_id, message });
            res.status(201).json(chat);
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }
}