import { Request, Response } from "express"
import { CartItems } from "../models/CartItems"
import { ProductVariants } from "../models/ProductVariants"
import { Products } from "../models/Products"
import { Shops } from "../models/Shops"

export class CartController {
    // add to cart
    static async addToCart(req: Request, res: Response) {
        try {
            const { variant_id, quantity } = req.body
            const user_id = (req as any).user.id 

            // cek stock
            const variant = await ProductVariants.findByPk(variant_id)
            if (!variant) {
                 return res.status(404).json({
                    message: "Varian produk tidak ditemukan"
                })
            }
            if (variant.stock < quantity) {
                return res.status(400).json({
                    message: "Stok tidak mencukupi"
                })
            }

            // cek barang udh ada di cart blm
            const existingItem = await CartItems.findOne({
                where: { user_id, variant_id }
            })

            if (existingItem) {
                existingItem.quantity += quantity
                await existingItem.save()
                return res.json({
                    message: "Quantity updated",
                    data: existingItem
                })
            }

            const newItem = await CartItems.create({
                user_id,
                variant_id,
                quantity,
                is_selected: true
            })

            res.status(201).json({
                message: "Berhasil ditambah ke cart",
                data: newItem
            })
        } catch (error: any) {
            res.status(500).json({
                message: error.message
            })
        }
    }

    // liat isi cart & total 
    static async getCart(req: Request, res: Response) {
        try {
            const user_id = (req as any).user.id

            const cartItems = await CartItems.findAll({
                where: { user_id },
                include: [{
                    model: ProductVariants,
                    include: [{
                        model: Products,
                        include: [Shops] // groupby shops
                    }]
                }]
            })

            // ngitung total cuma buat is_selected == true
            let totalPrice = 0
            cartItems.forEach(item => {
                if (item.is_selected) {
                    totalPrice += Number(item.variant.price) * item.quantity
                }
            })

            res.json({
                data: cartItems,
                total_payment: totalPrice
            })
        } catch (error: any) {
            res.status(500).json({
                message: error.message
            })
        }
    }

    // update quantity / selection
    static async updateCart(req: Request, res: Response) {
        try {
            const { variant_id } = req.params
            const { quantity, is_selected } = req.body
            const user_id = (req as any).user.id

            const item = await CartItems.findOne({ where: { user_id, variant_id } })
            if (!item) {
                return res.status(404).json({
                    message: "Item tidak ditemukan"
                })
            } 
            if (quantity !== undefined) {
                item.quantity = quantity
            }
            if (is_selected !== undefined) { 
                item.is_selected = is_selected
            }

            await item.save()
            res.json({
                message: "Cart berhasil diupdate",
                data: item
            })
        } catch (error: any) {
            res.status(500).json({
                message: error.message
            })
        }
    }

    // delete item from cart
    static async deleteItem(req: Request, res: Response) {
        try {
            const { variant_id } = req.params
            const user_id = (req as any).user.id

            const deleted = await CartItems.destroy({ where: { user_id, variant_id } })
            if (!deleted) {
                return res.status(404).json({
                    message: "Item tidak ditemukan"
                })
            }

            res.json({ message: "Item dihapus dari cart" })
        } catch (error: any) {
            res.status(500).json({
                message: error.message
            })
        }
    }
}