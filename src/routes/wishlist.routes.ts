import { Router } from "express"
import { WishlistController } from "../controllers/WishlistController"
import auth from "../middlewares/auth.middleware"

const router: Router = Router()

// get all wishlsit
router.get("/", WishlistController.getWishlist)

// like barang
router.post("/", WishlistController.toggleWishlist)

export default router