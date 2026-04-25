import { Request, Response } from "express"
import { Wishlists } from "../models/Wishlists"
import { Products } from "../models/Products"
import { ProductVariants } from "../models/ProductVariants"

export class WishlistController {
    // add to wishlist
    // kl blm ada -> di like
    // kl udh ada -> di unlike
    static async toggleWishlist(req: Request, res: Response) {
        try {
            const { product_id, user_id } = req.body

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
            throw error;
        }
    }

    // get all wishlist
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
        } catch (error: any) {
            throw error;
        }
    }
}

// masih kurang : dari wishlist bisa di add to cart???