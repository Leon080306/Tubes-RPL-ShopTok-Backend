import { Request, Response } from "express"
import { sequelize } from "../main"
import { CartItems } from "../models/CartItems"
import { Orders } from "../models/Orders"
import { OrderItems } from "../models/OrderItems"
import { ProductVariants } from "../models/ProductVariants"
import { Products } from "../models/Products"
import { Vouchers } from "../models/Vouchers"
import { VouchersUsed } from "../models/VouchersUsed"

export class OrderController {
  static async checkout(req: Request, res: Response) {
    const t = await sequelize.transaction()

    try {
      const customer_id = (req as any).user.id
      const { address_id, voucher_id } = req.body

      if (!address_id) {
        return res.status(400).json({
          message: "Alamat pengiriman wajib diisi",
        })
      }

      // ambil product dari cart
      const cartItems = await CartItems.findAll({
        where: { user_id: customer_id, is_selected: true },
        include: [
          {
            model: ProductVariants,
            include: [{ model: Products }],
          },
        ],
      })

      if (cartItems.length === 0) {
        return res.status(400).json({
          message: "Pilih barang di cart dulu",
        })
      }

      // logicnya : ngelompokin product berdasarkan shopnya (pake shop_id)
      const itemsByShop: { [key: string]: any[] } = {}
      cartItems.forEach((item) => {
        const shopId = item.variant.product.shop_id
        if (!itemsByShop[shopId]) itemsByShop[shopId] = []
        itemsByShop[shopId].push(item)
      })

      const createdOrders = []

      // loop tiap shop -> bikin order buat masing" shop
      // jujur lupa kmrn diskusi logicnya gini ga ya?
      for (const shopId in itemsByShop) {
        const items = itemsByShop[shopId]

        if (!items) continue

        let shopTotal = 0

        // ngitung total per shop & cek stock
        if (items) {
          let shopTotal = 0
          for (const item of items) {
            if (item.variant.stock < item.quantity) {
              throw new Error(`Stok ${item.variant.name} habis`)
            }
            shopTotal += Number(item.variant.price) * item.quantity
          }
        }

        // logic voucher : diskonnya cuma buat orderan pertama aja
        let finalAmount = shopTotal
        if (voucher_id && createdOrders.length === 0) {
          const voucher = await Vouchers.findByPk(voucher_id)
          if (voucher) {
            finalAmount -= Number(voucher.discount_value)
          }
        }

        // bikin order buat shop tsb
        const order = await Orders.create(
          {
            customer_id: customer_id,
            shop_id: shopId,
            address_id: address_id,
            status: "pending",
            amount_paid: finalAmount < 0 ? 0 : finalAmount,
          },
          { transaction: t },
        )

        // bikin orderitems & update stock product variant
        for (const item of items) {
          await OrderItems.create(
            {
              order_id: order.order_id,
              variant_id: item.variant_id,
              quantity: item.quantity,
            },
            { transaction: t },
          )

          await ProductVariants.update(
            { stock: item.variant.stock - item.quantity },
            { where: { variant_id: item.variant_id }, transaction: t },
          )
        }

        // update voucher used
        if (voucher_id && createdOrders.length === 0) {
          await VouchersUsed.create(
            {
              voucher_id: voucher_id,
              order_id: order.order_id,
            },
            { transaction: t },
          )
        }

        createdOrders.push(order)
      }

      // delete prod yg udah di cekout
      await CartItems.destroy({
        where: { user_id: customer_id, is_selected: true },
        transaction: t,
      })

      await t.commit()
      res.status(201).json({
        message: "Checkout berhasil!",
        orders: createdOrders,
      })
    } catch (error: any) {
      await t.rollback()
      res.status(500).json({ message: error.message })
    }
  }

  static async cancelOrder(req: Request, res: Response) {
    const t = await sequelize.transaction()
    try {
      const { order_id } = req.params
      const customer_id = (req as any).user.id

      const order = await Orders.findOne({
        where: { order_id, customer_id, status: "pending" },
        include: [OrderItems],
      })

      if (!order) {
        return res.status(404).json({
            message: "Order tidak ditemukan / tidak bisa dicancel",
          })
      }

      // status order jadi cancelled
      await order.update({ status: "cancelled" }, { transaction: t })

      // balikin stock per products
      for (const item of order.orderItems) {
        const variant = await ProductVariants.findByPk(item.variant_id)
        if (variant) {
          await variant.update(
            { stock: variant.stock + item.quantity },
            { transaction: t },
          )
        }
      }

      // delete voucher used. logicnya sih vouchernya bisa dipake lagi kalo ordernya dicancel
      await VouchersUsed.destroy({
        where: { order_id: order.order_id },
        transaction: t,
      })

      await t.commit()
      res.json({
        message: "Order berhasil dicancel"
        })
    } catch (error: any) {
      await t.rollback()
      res.status(500).json({
        message: error.message
        })
    }
  }
}
