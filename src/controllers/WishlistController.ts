import { Request, Response } from "express"
import { Wishlists } from "../models/Wishlists"
import { Products } from "../models/Products"
import { ProductVariants } from "../models/ProductVariants"

export class WishlistController {

    // ─────────────────────────────
    // TOGGLE WISHLIST
    // POST /api/wishlist
    // ─────────────────────────────
    static async toggleWishlist(req: Request, res: Response) {
        try {
            const { product_id, user_id } = req.body

            if (!product_id) {
                return res.status(400).json({ message: "product_id is required" })
            }

            const product = await Products.findByPk(product_id)
            if (!product) {
                return res.status(404).json({
                    message: "Produk tidak ditemukan"
                })
            }
            const existing = await Wishlists.findOne({
                where: { user_id, product_id }
            })

            if (existing) {
                await existing.destroy()
                return res.status(200).json({ message: "Produk di-unlike dari wishlist" })
            }

            await Wishlists.create({ user_id, product_id })
            return res.status(201).json({ message: "Produk berhasil di-like ke wishlist" })

        } catch (error: any) {
            throw error;
        }
    }

    // ─────────────────────────────
    // GET WISHLIST
    // GET /api/wishlist
    // ─────────────────────────────
    static async getWishlist(req: Request, res: Response) {
        try {
            const user_id = req.query.user_id as string
            const items = await Wishlists.findAll({
                where: { user_id },
                include: [
                    {
                        model: Products,
                        as: "product",
                        include: [
                            {
                                model: ProductVariants,
                                as: "variants"
                            }
                        ]
                    }
                ]
            })
            return res.status(200).json({ data: items })
        } catch (error: any) {
            throw error;
        }
    }
}