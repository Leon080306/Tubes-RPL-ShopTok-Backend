import { Request, Response } from "express"
import { sequelize } from "../main"
import { CartItems } from "../models/CartItems"
import { Orders } from "../models/Orders"
import { OrderItems } from "../models/OrderItems"
import { ProductVariants } from "../models/ProductVariants"
import { Products } from "../models/Products"
import { Vouchers } from "../models/Vouchers"
import { VouchersUsed } from "../models/VouchersUsed"
import { Users } from "../models/Users"
import { Op } from "sequelize"

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

        if (items) {
          let shopTotal = 0
          for (const item of items) {
            if (item.variant.stock < item.quantity) {
              throw new Error(`Stok ${item.variant.name} habis`)
            }
            shopTotal += Number(item.variant.price) * item.quantity
          }
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
            customer_id: customer_id,
            shop_id: shopId,
            address_id: address_id,
            status: "pending",
            amount_paid: finalAmount < 0 ? 0 : finalAmount,
          },
          { transaction: t },
        )

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

      await order.update({ status: "cancelled" }, { transaction: t })

      for (const item of order.orderItems) {
        const variant = await ProductVariants.findByPk(item.variant_id)
        if (variant) {
          await variant.update(
            { stock: variant.stock + item.quantity },
            { transaction: t },
          )
        }
      }

      await VouchersUsed.destroy({
        where: { order_id: order.order_id },
        transaction: t,
      })

      await t.commit()
      res.json({
        message: "Order berhasil dicancel",
      })
    } catch (error: any) {
      await t.rollback()
      res.status(500).json({
        message: error.message,
      })
    }
  }

  // ─────────────────────────────
  // GET ALL ORDERS BY SHOP
  // GET /api/orders/shop/:shopId
  // ─────────────────────────────
  static async getByShop(req: Request, res: Response) {
    try {
      const { shopId } = req.params

      const orders = await Orders.findAll({
        where: { shop_id: shopId },
        include: [
          {
            model: OrderItems,
            as: "items",
            include: [
              {
                model: ProductVariants,
                as: "variant",
                attributes: ["variant_id", "name", "picture", "price"],
                include: [
                  {
                    model: Products,
                    as: "product",
                    attributes: ["product_id", "name"],
                  },
                ],
              },
            ],
          },
          {
            model: Users,
            as: "customer",
            attributes: ["user_id", "first_name", "last_name", "profile_pic"],
          },
        ],
        order: [["createdAt", "DESC"]],
      })

      return res.status(200).json({
        message: "Success",
        records: orders,
      })
    } catch (error) {
      console.error("getByShop error:", error)
      return res.status(500).json({ message: "Failed to fetch orders", error })
    }
  }

  // ─────────────────────────────
  // GET SHOP STATS
  // GET /api/orders/shop/:shopId/stats
  // ─────────────────────────────
  static async getShopStats(req: Request, res: Response) {
    try {
      const { shopId } = req.params

      const orders = await Orders.findAll({
        where: { shop_id: shopId },
        attributes: ["order_id", "status", "amount_paid"],
      })

      const statusBreakdown: Record<string, number> = {
        pending: 0,
        paid: 0,
        shipped: 0,
        cancelled: 0,
      }

      let totalRevenue = 0

      orders.forEach((order: any) => {
        const status = order.status?.toLowerCase()
        if (statusBreakdown[status] !== undefined) {
          statusBreakdown[status]++
        }
        if (status !== "cancelled") {
          totalRevenue += Number(order.amount_paid ?? 0)
        }
      })

      const products = await Products.findAll({
        where: { shop_id: shopId },
        attributes: ["view_count"],
      })

      const totalViews = products.reduce(
        (acc, p) => acc + ((p as any).view_count ?? 0), 0
      )

      return res.status(200).json({
        message: "Success",
        records: {
          totalRevenue,
          totalOrders: orders.length,
          totalProducts: products.length,
          totalViews,
          statusBreakdown,
        },
      })
    } catch (error) {
      console.error("getShopStats error:", error)
      return res.status(500).json({ message: "Failed to fetch stats", error })
    }
  }

  // ─────────────────────────────
  // GET REVENUE CHART
  // GET /api/orders/shop/:shopId/revenue?range=7D
  // ─────────────────────────────
  static async getRevenueChart(req: Request, res: Response) {
    try {
      const { shopId } = req.params
      const range = (req.query.range as string) ?? "7D"

      const now = new Date()
      const from = new Date()
      if (range === "7D") from.setDate(now.getDate() - 7)
      else if (range === "30D") from.setDate(now.getDate() - 30)
      else if (range === "3M") from.setMonth(now.getMonth() - 3)

      const orders = await Orders.findAll({
        where: {
          shop_id: shopId,
          status: { [Op.ne]: "cancelled" },
          createdAt: { [Op.gte]: from },
        },
        attributes: ["order_id", "amount_paid", "createdAt"],
      })

      // group by date
      const dateMap = new Map<string, { revenue: number; orders: number }>()

      orders.forEach((order: any) => {
        const dateKey = new Date(order.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })

        if (!dateMap.has(dateKey)) {
          dateMap.set(dateKey, { revenue: 0, orders: 0 })
        }

        const entry = dateMap.get(dateKey)!
        entry.revenue += Number(order.amount_paid ?? 0)
        entry.orders++
      })

      const result = [...dateMap.entries()].map(([date, data]) => ({
        date,
        revenue: data.revenue,
        orders: data.orders,
      }))

      return res.status(200).json({
        message: "Success",
        records: result,
      })
    } catch (error) {
      console.error("getRevenueChart error:", error)
      return res.status(500).json({ message: "Failed to fetch revenue data", error })
    }
  }

  // ─────────────────────────────
  // GET TOP PRODUCTS
  // GET /api/orders/shop/:shopId/top-products
  // ─────────────────────────────
  static async getTopProducts(req: Request, res: Response) {
    try {
      const { shopId } = req.params

      const items = await OrderItems.findAll({
        include: [
          {
            model: ProductVariants,
            as: "variant",
            attributes: ["variant_id", "product_id", "picture", "price"],
            include: [
              {
                model: Products,
                as: "product",
                where: { shop_id: shopId },
                attributes: ["product_id", "name"],
              },
            ],
          },
          {
            model: Orders,
            as: "order",
            where: {
              shop_id: shopId,
              status: { [Op.ne]: "cancelled" },
            },
            attributes: ["order_id"],
          },
        ],
        attributes: ["order_id", "quantity"],
      })

      const productMap = new Map<string, {
        product_id: string
        name: string
        picture: string | null
        totalRevenue: number
        totalUnits: number
      }>()

      items.forEach((item: any) => {
        const product = item.variant?.product
        const pid = product?.product_id
        if (!pid) return

        if (!productMap.has(pid)) {
          productMap.set(pid, {
            product_id: pid,
            name: product.name,
            picture: item.variant?.picture ?? null,
            totalRevenue: 0,
            totalUnits: 0,
          })
        }

        const entry = productMap.get(pid)!
        entry.totalRevenue += Number(item.variant?.price ?? 0) * Number(item.quantity ?? 1)
        entry.totalUnits += Number(item.quantity ?? 1)
      })

      const sorted = [...productMap.values()]
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
        .slice(0, 5)

      const maxRevenue = sorted[0]?.totalRevenue ?? 1
      const result = sorted.map((p) => ({
        ...p,
        pct: Math.round((p.totalRevenue / maxRevenue) * 100),
      }))

      return res.status(200).json({
        message: "Success",
        records: result,
      })
    } catch (error) {
      console.error("getTopProducts error:", error)
      return res.status(500).json({ message: "Failed to fetch top products", error })
    }
  }

  // ─────────────────────────────
  // GET RECENT ORDERS
  // GET /api/orders/shop/:shopId/recent
  // ─────────────────────────────
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
            attributes: ["user_id", "first_name", "last_name"],
          },
        ],
        order: [["createdAt", "DESC"]],
        limit,
        attributes: ["order_id", "status", "amount_paid", "createdAt"],
      })

      const result = orders.map((order: any) => ({
        order_id: order.order_id,
        customer: `${order.customer?.first_name ?? ""} ${order.customer?.last_name ?? ""}`.trim(),
        amount: order.amount_paid,
        status: order.status,
        createdAt: order.createdAt,
      }))

      return res.status(200).json({
        message: "Success",
        records: result,
      })
    } catch (error) {
      console.error("getRecentOrders error:", error)
      return res.status(500).json({ message: "Failed to fetch recent orders", error })
    }
  }
}