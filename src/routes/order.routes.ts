import { Router } from "express"
import { OrderController } from "../controllers/OrderController"
import { asyncHandler } from "../utils/asyncHandler"

const router: Router = Router()

router.post("/checkout", asyncHandler(OrderController.checkout))
router.get('/shop/:shop_id', asyncHandler(OrderController.getShopOrders))
router.patch('/status/:order_id', asyncHandler(OrderController.updateOrderStatus))
router.get('/', asyncHandler(OrderController.getMyOrders))
router.get('/:order_id', asyncHandler(OrderController.getOrderDetail))
router.patch("/cancel/:order_id", asyncHandler(OrderController.cancelOrder))

export default router