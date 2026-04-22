import { Router } from "express"
import { OrderController } from "../controllers/OrderController"
import auth from "../middlewares/auth.middleware"

const router: Router = Router()

// bikin order
router.post("/checkout", auth, OrderController.checkout)

// cancel order
router.put("/cancel/:order_id", auth, OrderController.cancelOrder);

export default router