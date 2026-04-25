import { Request, Response } from "express"
import { CartItems } from "../models/CartItems"
import { ProductVariants } from "../models/ProductVariants"
import { Products } from "../models/Products"
import { Shops } from "../models/Shops"

export class CartController {
  // add to cart
  static async addToCart(req: Request, res: Response) {
    try {
      const { user_id, variant_id, quantity } = req.body

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

      // ✅ Include soft-deleted rows
      const existingItem = await CartItems.findOne({
        where: { user_id, variant_id },
        paranoid: false
      })

      if (existingItem) {
        // ✅ Restore if soft-deleted
        if (existingItem.deletedAt) {
          await existingItem.restore()
        }
        existingItem.quantity = (existingItem.deletedAt ? 0 : existingItem.quantity) + quantity
        existingItem.is_selected = false
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
        is_selected: false
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
      const user_id = req.query.user_id as string;

      if (!user_id) {
        return res.status(400).json({
          message: "user_id wajib dikirim"
        });
      }

      const cartItems = await CartItems.findAll({
        where: { user_id },
        include: [
          {
            model: ProductVariants,
            as: "variant",
            include: [
              {
                model: Products,
                as: "product",
                include: [
                  {
                    model: Shops,
                    as: "shop"
                  }
                ]
              }
            ]
          }
        ]
      });

      let totalPrice = 0;

      cartItems.forEach((item: any) => {
        if (item.is_selected) {
          totalPrice += Number(item.variant.price) * item.quantity;
        }
      });

      res.json({
        data: cartItems,
        total_payment: totalPrice
      });

    } catch (error: any) {
      res.status(500).json({
        message: error.message
      });
    }
  }

  // update quantity / selection
  static async updateCart(req: Request, res: Response) {
    try {
      const { variant_id } = req.params
      const { quantity, is_selected } = req.body
      const user_id = req.query.user_id as string

      if (!user_id) {
        return res.status(400).json({ message: "user_id wajib dikirim" })
      }

      const item = await CartItems.findOne({ where: { user_id, variant_id } })
      if (!item) {
        return res.status(404).json({ message: "Item tidak ditemukan" })
      }

      // ✅ Build update object
      const updateData: { quantity?: number; is_selected?: boolean } = {}
      if (quantity !== undefined) updateData.quantity = quantity
      if (is_selected !== undefined) updateData.is_selected = is_selected

      // ✅ Use static update() instead of instance save()
      await CartItems.update(updateData, {
        where: { user_id, variant_id }
      })

      // Fetch updated item to return
      const updated = await CartItems.findOne({ where: { user_id, variant_id } })

      res.json({ message: "Cart updated", data: updated })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }

  // delete item from cart
  static async deleteItem(req: Request, res: Response) {
    try {
      const { variant_id } = req.params
      const user_id = req.query.user_id as string  // ✅ konsisten

      if (!user_id) {
        return res.status(400).json({ message: "user_id wajib dikirim" })
      }

      const deleted = await CartItems.destroy({ where: { user_id, variant_id } })
      if (!deleted) {
        return res.status(404).json({ message: "Item tidak ditemukan" })
      }

      res.json({ message: "Item dihapus dari cart" })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }
}