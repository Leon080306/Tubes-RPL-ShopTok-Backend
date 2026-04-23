import { Router } from "express"
import { CartController } from "../controllers/CartController"

const router:Router = Router()

// get cart
router.get("/", CartController.getCart)

// add to cart
router.post("/", CartController.addToCart)

// update quantity / is_selected
// pake patch krn cuma updte sebagian data
router.patch("/:variant_id", CartController.updateCart)

// delete from cart
router.delete("/:variant_id", CartController.deleteItem)

export default router
