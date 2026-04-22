import { Router } from "express";
import { ShopsController } from "../controllers/shops.controller";

const router: Router = Router();

router.get("/", ShopsController.getAll);
router.get("/:id", ShopsController.getById);
// router.post("/", ShopsController.create);
// router.put("/:id",  ShopsController.update);
// router.delete("/:id",  ShopsController.delete);

export default router;