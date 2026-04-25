import { Router } from "express"
import { WishlistController } from "../controllers/WishlistController"
import { asyncHandler } from "../utils/asyncHandler"

const router: Router = Router()

// get all wishlsit
router.get("/", asyncHandler(WishlistController.getWishlist))

// like barang
router.post("/", asyncHandler(WishlistController.toggleWishlist))

export default router