import { Router } from "express"
import { VoucherController } from "../controllers/VoucherController"
import { asyncHandler } from "../utils/asyncHandler"

const router: Router = Router()

// get all voucher yg bisa dipake
router.get("/", asyncHandler(VoucherController.getAvailableVouchers))

// validate voucher pas cekout
router.post("/validate", asyncHandler(VoucherController.validateVoucher))

export default router