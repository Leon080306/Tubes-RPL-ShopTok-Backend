import { Router } from "express"
import { WishlistController } from "../controllers/WishlistController"
import auth from "../middlewares/auth.middleware"

const router: Router = Router()

// get all wishlsit
router.get("/", auth, WishlistController.getWishlist)

// like barang
router.post("/", auth, WishlistController.toggleWishlist)

export default router