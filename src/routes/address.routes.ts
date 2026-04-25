import { Router } from "express";
import { AddressController } from "../controllers/address.controller";
import { asyncHandler } from "../utils/asyncHandler";

const router: Router = Router();

router.get("/:user_id", asyncHandler(AddressController.getByUserId));
router.post("/", asyncHandler(AddressController.create));
router.put("/:address_id", asyncHandler(AddressController.update));
router.get("/detail/:address_id", asyncHandler(AddressController.getById));

export default router;