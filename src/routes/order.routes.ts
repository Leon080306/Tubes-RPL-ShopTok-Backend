import { Router } from "express"
import { OrderController } from "../controllers/OrderController"

const router: Router = Router()

// customer
router.post("/checkout", OrderController.checkout)
router.put("/cancel/:order_id", OrderController.cancelOrder)
router.get('/', OrderController.getMyOrders)
router.get('/:order_id', OrderController.getOrderDetail)

// seller — letakkan sebelum /:order_id biar ga bentrok
router.get('/shop/:shop_id', OrderController.getShopOrders)
router.patch('/status/:order_id', OrderController.updateOrderStatus)

export default router