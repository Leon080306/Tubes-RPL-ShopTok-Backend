import { Request, Response } from "express"
import { sequelize } from "../main"
import { CartItems } from "../models/CartItems"
import { Orders } from "../models/Orders"
import { OrderItems } from "../models/OrderItems"
import { ProductVariants } from "../models/ProductVariants"
import { Products } from "../models/Products"
import { Vouchers } from "../models/Vouchers"
import { VouchersUsed } from "../models/VouchersUsed"
import { Addresses } from "../models/Addresses"
import { Shops } from "../models/Shops"
import { Users } from "../models/Users"

export class OrderController {
  static async checkout(req: Request, res: Response) {
    const t = await sequelize.transaction()

    try {
      const { address_id, voucher_id, customer_id } = req.body

      if (!customer_id) return res.status(400).json({ message: "customer_id wajib dikirim" })

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

      for (const shopId in itemsByShop) {
        const items = itemsByShop[shopId]
        if (!items) continue

        let shopTotal = 0
        // 1. Hitung total per shop dulu
        for (const item of items) {
          if (item.variant.stock < item.quantity) {
            throw new Error(`Stok ${item.variant.product.name} varian ${item.variant.name} tidak mencukupi`)
          }
          shopTotal += Number(item.variant.price) * item.quantity
        }

        // 2. Logic Voucher (Cuma dipotong di orderan shop pertama)
        let finalAmount = shopTotal
        if (voucher_id && createdOrders.length === 0) {
          const voucher = await Vouchers.findByPk(voucher_id)
          if (voucher) {
            finalAmount -= Number(voucher.discount_value)
          }
        }

        // 3. Create Order
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

        // 4. Create Items & Update Stock
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
      const customer_id = req.query.customer_id as string

      if (!customer_id) return res.status(400).json({ message: "customer_id wajib dikirim" })

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

  static async getOrderDetail(req: Request, res: Response) {
    try {
        const { order_id } = req.params
        const customer_id = req.query.customer_id as string

        if (!customer_id) return res.status(400).json({ message: "customer_id wajib dikirim" })

        const order = await Orders.findOne({
            where: { order_id, customer_id },
            include: [
                {
                    model: OrderItems,
                    include: [
                        {
                            model: ProductVariants,
                            include: [{ model: Products }]
                        }
                    ]
                },
                { model: Addresses },
            ]
        })

        if (!order) {
            return res.status(404).json({ message: "Order tidak ditemukan" })
        }

        res.json({ data: order })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
  }

  static async getMyOrders(req: Request, res: Response) {
    try {
        const customer_id = req.query.customer_id as string
        const { status } = req.query

        if (!customer_id) return res.status(400).json({ message: "customer_id wajib dikirim" })

        const whereClause: any = { customer_id }
        if (status && status !== 'all') {
            whereClause.status = status
        }

        const orders = await Orders.findAll({
            where: whereClause,
            include: [
                {
                    model: OrderItems,
                    include: [
                        {
                            model: ProductVariants,
                            include: [{ model: Products }]
                        }
                    ]
                },
                { model: Shops },
            ],
            order: [['createdAt', 'DESC']]
        })

        res.json({ data: orders })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
  }

  // GET /order/shop/:shop_id — seller lihat semua order masuk ke tokonya
static async getShopOrders(req: Request, res: Response) {
    try {
        const { shop_id } = req.params
        const seller_id = req.query.seller_id as string
        const { status } = req.query

        if (!seller_id) return res.status(400).json({ message: "seller_id wajib dikirim" })

        // Validasi: shop harus milik seller ini
        const shop = await Shops.findOne({ where: { shop_id, owner_id: seller_id } })
        if (!shop) {
            return res.status(403).json({ message: "Bukan toko kamu" })
        }

        const whereClause: any = { shop_id }
        if (status && status !== 'all') {
            whereClause.status = status
        }

        const orders = await Orders.findAll({
            where: whereClause,
            include: [
                {
                    model: OrderItems,
                    include: [
                        {
                            model: ProductVariants,
                            include: [{ model: Products }]
                        }
                    ]
                },
                { model: Addresses },
                { model: Users, as: 'customer', attributes: ['first_name', 'last_name', 'email', 'phone_number', 'profile_pic'] }
            ],
            order: [['createdAt', 'DESC']]
        })

        res.json({ data: orders })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

// PATCH /order/status/:order_id — seller update status order
static async updateOrderStatus(req: Request, res: Response) {
    try {
        const { order_id } = req.params
        const { status, seller_id } = req.body

        if (!seller_id) return res.status(400).json({ message: "seller_id wajib dikirim" })

        const ALLOWED_STATUSES = ['pending', 'completed', 'cancelled']
        if (!ALLOWED_STATUSES.includes(status)) {
            return res.status(400).json({ message: "Status tidak valid" })
        }

        // Cari order, pastiin emang order ke toko si seller
        const order = await Orders.findOne({
            where: { order_id },
            include: [{ model: Shops }]
        })

        if (!order) {
            return res.status(404).json({ message: "Order tidak ditemukan" })
        }
        if (order.shop.owner_id !== seller_id) {
            return res.status(403).json({ message: "Bukan order toko kamu" })
        }

        await order.update({ status })
        res.json({ message: "Status berhasil diupdate", data: order })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}
}
