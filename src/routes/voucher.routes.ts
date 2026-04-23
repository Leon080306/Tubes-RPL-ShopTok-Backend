import { Router } from "express"
import { VoucherController } from "../controllers/VoucherController"

const router: Router = Router()

// get all voucher yg bisa dipake
router.get("/", VoucherController.getAvailableVouchers)

// validate voucher pas cekout
router.post("/validate", VoucherController.validateVoucher)

export default router