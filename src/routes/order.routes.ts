import { Router } from "express"
import { OrderController } from "../controllers/OrderController"
import auth from "../middlewares/auth.middleware"

const router: Router = Router()

// ─── Shop dashboard routes (no auth needed, seller-facing) ───
router.get("/shop/:shopId/stats", OrderController.getShopStats)
router.get("/shop/:shopId/revenue", OrderController.getRevenueChart)
router.get("/shop/:shopId/top-products", OrderController.getTopProducts)
router.get("/shop/:shopId/recent", OrderController.getRecentOrders)
router.get("/shop/:shopId", OrderController.getByShop)

// ─── Existing routes ─────────────────────────────────────────
router.post("/checkout", auth, OrderController.checkout)
router.put("/cancel/:order_id", auth, OrderController.cancelOrder)

export default router