import { Request, Response } from "express"
import { Wishlists } from "../models/Wishlists"
import { Products } from "../models/Products"

export class WishlistController {
    // add to wishlist
    // kl blm ada -> di like
    // kl udh ada -> di unlike
    static async toggleWishlist(req: Request, res: Response) {
        try {
            const { product_id } = req.body
            const user_id = (req as any).user.id

            // cek product ada ga
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
                return res.json({
                    message: "Produk di-unlike dari wishlist"
                })
            }

            await Wishlists.create({ user_id, product_id })
            res.status(201).json({
                message: "Produk berhasil di-like ke wishlist"
            })
        } catch (error: any) {
            res.status(500).json({
                message: error.message
            })
        }
    }

    // get all wishlist
    static async getWishlist(req: Request, res: Response) {
        try {
            const user_id = (req as any).user.id
            const items = await Wishlists.findAll({
                where: { user_id },
                include: [Products]
            })
            res.json({
                data: items
            })
        } catch (error: any) {
            res.status(500).json({
                message: error.message
            })
        }
    }
}

// masih kurang : dari wishlist bisa di add to cart???