import { Router } from "express"
import { OrderController } from "../controllers/OrderController"

const router: Router = Router()

router.post("/checkout", OrderController.checkout)
router.get('/shop/:shop_id', OrderController.getShopOrders) 
router.patch('/status/:order_id', OrderController.updateOrderStatus)
router.get('/', OrderController.getMyOrders)
router.get('/:order_id', OrderController.getOrderDetail)
router.patch("/cancel/:order_id", OrderController.cancelOrder)

export default router