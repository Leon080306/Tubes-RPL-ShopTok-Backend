import { Router } from "express"
import { CartController } from "../controllers/CartController"
import { asyncHandler } from "../utils/asyncHandler"

const router: Router = Router()

// get cart
router.get("/", asyncHandler(CartController.getCart))

// add to cart
router.post("/", asyncHandler(CartController.addToCart))

// update quantity / is_selected
// pake patch krn cuma updte sebagian data
router.patch("/:variant_id", asyncHandler(CartController.updateCart))

// delete from cart
router.delete("/:variant_id", asyncHandler(CartController.deleteItem))

export default router
