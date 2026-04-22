import { Router } from "express"
import { OrderController } from "../controllers/OrderController"
import auth from "../middlewares/auth.middleware"

const router: Router = Router()

// customer
router.post("/checkout", auth, OrderController.checkout)
router.put("/cancel/:order_id", auth, OrderController.cancelOrder)
router.get('/', auth, OrderController.getMyOrders)
router.get('/:order_id', auth, OrderController.getOrderDetail)

// seller — letakkan sebelum /:order_id biar ga bentrok
router.get('/shop/:shop_id', auth, OrderController.getShopOrders)
router.patch('/status/:order_id', auth, OrderController.updateOrderStatus)

export default router