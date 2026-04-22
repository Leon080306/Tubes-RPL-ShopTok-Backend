import { Router } from "express";
import { AddressController } from "../controllers/address.controller";

const router: Router = Router();

router.get("/:user_id", AddressController.getByUserId);
router.post("/", AddressController.create);
router.put("/:address_id", AddressController.update);
router.get("/detail/:address_id", AddressController.getById);

export default router;