import { Router } from "express"
import { VoucherController } from "../controllers/VoucherController"
import auth from "../middlewares/auth.middleware"

const router: Router = Router()

// get all voucher yg bisa dipake
router.get("/", auth, VoucherController.getAvailableVouchers)

// validate voucher pas cekout
router.post("/validate", auth, VoucherController.validateVoucher)

export default router