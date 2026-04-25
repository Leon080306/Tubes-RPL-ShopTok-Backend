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
import { col, fn, Op, literal } from "sequelize"

export class OrderController {
  static async checkout(req: Request, res: Response) {
    const t = await sequelize.transaction()

    try {
      const { address_id, voucher_id, customer_id } = req.body

      if (!customer_id) return res.status(400).json({ message: "customer_id wajib dikirim" })
      if (!address_id) return res.status(400).json({ message: "Alamat pengiriman wajib diisi" })

      const cartItems = await CartItems.findAll({
        where: { user_id: customer_id, is_selected: true },
        include: [
          {
            model: ProductVariants,
            as: "variant",
            include: [
              {
                model: Products,
                as: "product",
              },
            ],
          },
        ],
      })

      if (!cartItems || cartItems.length === 0) {
        await t.rollback()
        return res.status(400).json({ message: "Pilih barang di cart dulu" })
      }

      const plainItems = cartItems.map((item) => item.toJSON()) as any[]

      // Group by shop
      const itemsByShop: { [key: string]: any[] } = {}
      plainItems.forEach((item) => {
        const shopId = item.variant.product.shop_id
        if (!itemsByShop[shopId]) itemsByShop[shopId] = []
        itemsByShop[shopId].push(item)
      })

      const createdOrders = []

      for (const shopId in itemsByShop) {
        const items = itemsByShop[shopId]
        if (!items) continue

        let shopTotal = 0

        // Validate stock with fresh DB values
        for (const item of items) {
          const freshVariant = await ProductVariants.findByPk(item.variant_id, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          })

          if (!freshVariant || freshVariant.stock < item.quantity) {
            throw new Error(
              `Stok ${item.variant.product.name} varian ${item.variant.name} tidak mencukupi (sisa: ${freshVariant?.stock ?? 0})`
            )
          }

          shopTotal += Number(item.variant.price) * item.quantity
        }

        let finalAmount = shopTotal
        if (voucher_id && createdOrders.length === 0) {
          const voucher = await Vouchers.findByPk(voucher_id)
          if (voucher) {
            finalAmount -= Number(voucher.discount_value)
          }
        }

        const order = await Orders.create(
          {
            customer_id,
            shop_id: shopId,
            address_id,
            status: "pending",
            amount_paid: finalAmount < 0 ? 0 : finalAmount,
          },
          { transaction: t }
        )

        for (const item of items) {
          await OrderItems.create(
            {
              order_id: order.order_id,
              variant_id: item.variant_id,
              quantity: item.quantity,
            },
            { transaction: t }
          )

          // Decrement stock using fresh DB value
          await ProductVariants.decrement("stock", {
            by: item.quantity,
            where: { variant_id: item.variant_id },
            transaction: t,
          })
        }

        if (voucher_id && createdOrders.length === 0) {
          await VouchersUsed.create(
            {
              voucher_id,
              order_id: order.order_id,
            },
            { transaction: t }
          )
        }

        createdOrders.push(order)
      }

      await CartItems.destroy({
        where: { user_id: customer_id, is_selected: true },
        transaction: t,
        force: true,
      })

      await t.commit()
      res.status(201).json({
        message: "Checkout berhasil!",
        orders: createdOrders,
      })
    } catch (error: any) {
      await t.rollback()
      console.error("CHECKOUT ERROR:", error)
      res.status(500).json({ message: error.message })
    }
  }

  static async cancelOrder(req: Request, res: Response) {
    const t = await sequelize.transaction()
    try {
      const { order_id } = req.params
      const customer_id = req.query.customer_id as string

      if (!customer_id) {
        await t.rollback()
        return res.status(400).json({ message: "customer_id wajib dikirim" })
      }

      const order = await Orders.findOne({
        where: { order_id, customer_id, status: "pending" },
        transaction: t,
        lock: t.LOCK.UPDATE,
      })

      if (!order) {
        await t.rollback()
        return res.status(404).json({
          message: "Order tidak ditemukan / tidak bisa dicancel",
        })
      }

      const orderItems = await OrderItems.findAll({
        where: { order_id },
        transaction: t,
        raw: true, // ← returns plain objects, bypasses class field shadowing
      })

      await order.update({ status: "cancelled" }, { transaction: t })

      for (const item of orderItems) {
        await ProductVariants.increment("stock", {
          by: item.quantity,
          where: { variant_id: item.variant_id },
          transaction: t,
        })
      }

      await VouchersUsed.destroy({
        where: { order_id: order.order_id },
        transaction: t,
      })

      await t.commit()
      res.json({ message: "Order berhasil dicancel" })
    } catch (error: any) {
      await t.rollback()
      console.error("CANCEL ORDER ERROR:", error)
      res.status(500).json({ message: error.message })
    }
  }

  static async getOrderDetail(req: Request, res: Response) {
    try {
      const { order_id } = req.params
      const customer_id = req.query.customer_id as string

      if (!customer_id) {
        return res.status(400).json({ message: "customer_id wajib dikirim" })
      }

      const order = await Orders.findOne({
        where: { order_id, customer_id },
        include: [
          {
            model: OrderItems,
            as: "orderItems",
            include: [
              {
                model: ProductVariants,
                as: "variant",
                include: [{ model: Products, as: "product" }],
              },
            ],
          },
          { model: Addresses },
          { model: Shops, attributes: ["shop_id", "name", "profile_pic"] },
        ],
      })

      if (!order) {
        return res.status(404).json({ message: "Order tidak ditemukan" })
      }

      res.json({ data: order })
    } catch (error: any) {
      console.error("GET ORDER DETAIL ERROR:", error)
      res.status(500).json({ message: error.message })
    }
  }

  static async getMyOrders(req: Request, res: Response) {
    try {
      const customer_id = req.query.customer_id as string
      const { status } = req.query

      if (!customer_id) {
        return res.status(400).json({ message: "customer_id wajib dikirim" })
      }

      const whereClause: any = { customer_id }
      if (status && status !== "all") {
        whereClause.status = status
      }

      const orders = await Orders.findAll({
        where: whereClause,
        include: [
          {
            model: OrderItems,
            as: "orderItems",
            include: [
              {
                model: ProductVariants,
                as: "variant",
                include: [{ model: Products, as: "product" }],
              },
            ],
          },
          { model: Shops, attributes: ["shop_id", "name", "profile_pic"] },
        ],
        order: [["createdAt", "DESC"]],
      })

      res.json({ data: orders })
    } catch (error: any) {
      console.error("GET MY ORDERS ERROR:", error)
      res.status(500).json({ message: error.message })
    }
  }

  static async getShopOrders(req: Request, res: Response) {
    try {
      const { shop_id } = req.params
      const seller_id = req.query.seller_id as string
      const { status } = req.query

      if (!seller_id) {
        return res.status(400).json({ message: "seller_id wajib dikirim" })
      }

      const shop = await Shops.findOne({ where: { shop_id, owner_id: seller_id } })
      if (!shop) {
        return res.status(403).json({ message: "Bukan toko kamu" })
      }

      const whereClause: any = { shop_id }
      if (status && status !== "all") {
        whereClause.status = status
      }

      const orders = await Orders.findAll({
        where: whereClause,
        include: [
          {
            model: OrderItems,
            as: "orderItems",
            include: [
              {
                model: ProductVariants,
                as: "variant",
                include: [{ model: Products, as: "product" }],
              },
            ],
          },
          { model: Addresses },
          {
            model: Users,
            as: "customer",
            attributes: ["first_name", "last_name", "email", "phone_number", "profile_pic"],
          },
        ],
        order: [["createdAt", "DESC"]],
      })

      res.json({ data: orders })
    } catch (error: any) {
      console.error("GET SHOP ORDERS ERROR:", error)
      res.status(500).json({ message: error.message })
    }
  }

  static async updateOrderStatus(req: Request, res: Response) {
    try {
      const { order_id } = req.params
      const { status, seller_id } = req.body

      if (!seller_id) {
        return res.status(400).json({ message: "seller_id wajib dikirim" })
      }

      const ALLOWED_STATUSES = ["pending", "completed", "cancelled"]
      if (!ALLOWED_STATUSES.includes(status)) {
        return res.status(400).json({ message: "Status tidak valid" })
      }

      const order = await Orders.findOne({
        where: { order_id },
        include: [{ model: Shops }],
      })

      if (!order) {
        return res.status(404).json({ message: "Order tidak ditemukan" })
      }
      if (order.shop.owner_id !== seller_id) {
        return res.status(403).json({ message: "Bukan order toko kamu" })
      }

      // If seller cancels, restore stock too
      if (status === "cancelled" && order.status !== "cancelled") {
        const t = await sequelize.transaction()
        try {
          await order.update({ status }, { transaction: t })

          const orderItems = await OrderItems.findAll({
            where: { order_id },
            transaction: t,
          })

          for (const item of orderItems) {
            await ProductVariants.increment("stock", {
              by: item.quantity,
              where: { variant_id: item.variant_id },
              transaction: t,
            })
          }

          await VouchersUsed.destroy({
            where: { order_id },
            transaction: t,
          })

          await t.commit()
        } catch (err) {
          await t.rollback()
          throw err
        }
      } else {
        await order.update({ status })
      }

      res.json({ message: "Status berhasil diupdate", data: order })
    } catch (error: any) {
      console.error("UPDATE ORDER STATUS ERROR:", error)
      res.status(500).json({ message: error.message })
    }
  }

  static async getShopStats(req: Request, res: Response) {
    try {
      const { shopId } = req.params

      const [totalRevenue, totalOrders, totalProducts, statusRows] = await Promise.all([
        Orders.sum("amount_paid", { where: { shop_id: shopId } }),
        Orders.count({ where: { shop_id: shopId } }),
        Products.count({ where: { shop_id: shopId } }),
        Orders.findAll({
          where: { shop_id: shopId },
          attributes: ["status", [fn("COUNT", col("order_id")), "count"]],
          group: ["status"],
          raw: true,
        }),
      ])

      const statusBreakdown = (statusRows as any[]).reduce((acc, row) => {
        acc[row.status] = Number(row.count)
        return acc
      }, {} as Record<string, number>)

      res.json({
        records: {
          totalRevenue: Number(totalRevenue ?? 0),
          totalOrders,
          totalProducts,
          totalViews: 0,
          statusBreakdown,
        },
      })
    } catch (error: any) {
      console.error("GET SHOP STATS ERROR:", error)
      res.status(500).json({ message: error.message })
    }
  }

  static async getShopRevenue(req: Request, res: Response) {
    try {
      const { shopId } = req.params
      const range = (req.query.range as string) ?? "7D"

      const days = range === "3M" ? 90 : range === "30D" ? 30 : 7
      const since = new Date()
      since.setDate(since.getDate() - days)

      const rows = await Orders.findAll({
        where: {
          shop_id: shopId,
          createdAt: { [Op.gte]: since },
        },
        attributes: [
          [fn("DATE", col("createdAt")), "date"],
          [fn("SUM", col("amount_paid")), "revenue"],
          [fn("COUNT", col("order_id")), "orders"],
        ],
        group: [fn("DATE", col("createdAt"))],
        order: [[fn("DATE", col("createdAt")), "ASC"]],
        raw: true,
      })

      res.json({
        records: (rows as any[]).map((r) => ({
          date: r.date,
          revenue: Number(r.revenue),
          orders: Number(r.orders),
        })),
      })
    } catch (error: any) {
      console.error("GET SHOP REVENUE ERROR:", error)
      res.status(500).json({ message: error.message })
    }
  }

  static async getRecentOrders(req: Request, res: Response) {
    try {
      const { shopId } = req.params
      const limit = Number(req.query.limit ?? 5)

      const orders = await Orders.findAll({
        where: { shop_id: shopId },
        include: [
          {
            model: Users,
            as: "customer",
            attributes: ["first_name", "last_name"],
          },
        ],
        order: [["createdAt", "DESC"]],
        limit,
      })

      res.json({
        records: orders.map((o: any) => {
          const plain = o.toJSON()
          return {
            order_id: plain.order_id,
            customer: plain.customer
              ? `${plain.customer.first_name} ${plain.customer.last_name}`
              : "—",
            amount: Number(plain.amount_paid),
            status: plain.status,
            createdAt: plain.createdAt,
          }
        }),
      })
    } catch (error: any) {
      console.error("GET RECENT ORDERS ERROR:", error)
      res.status(500).json({ message: error.message })
    }
  }

  static async getTopProducts(req: Request, res: Response) {
    try {
      const { shopId } = req.params

      const rows = await OrderItems.findAll({
        include: [
          {
            model: ProductVariants,
            as: "variant",
            attributes: ["price", "picture"],
            include: [
              {
                model: Products,
                as: "product",
                where: { shop_id: shopId },
                attributes: ["product_id", "name"],
              },
            ],
          },
        ],
        attributes: [
          "variant_id",
          [fn("SUM", col("quantity")), "totalUnits"],
        ],
        group: [
          '"OrderItems"."variant_id"',
          '"variant"."variant_id"',
          '"variant->product"."product_id"',
        ],
        order: [[fn("SUM", col("quantity")), "DESC"]],
        limit: 5,
        raw: false,
      })

      const results = (rows as any[]).map((r) => {
        const plain = r.toJSON()
        const totalUnits = Number(plain.totalUnits)
        const totalRevenue = totalUnits * Number(plain.variant?.price ?? 0)
        return {
          product_id: plain.variant?.product?.product_id,
          name: plain.variant?.product?.name ?? "—",
          picture: plain.variant?.picture ?? null,
          totalRevenue,
          totalUnits,
        }
      })

      const maxRevenue = Math.max(...results.map((r) => r.totalRevenue), 1)
      const withPct = results.map((r) => ({
        ...r,
        pct: Math.round((r.totalRevenue / maxRevenue) * 100),
      }))

      res.json({ records: withPct })
    } catch (error: any) {
      console.error("GET TOP PRODUCTS ERROR:", error)
      res.status(500).json({ message: error.message })
    }
  }
}