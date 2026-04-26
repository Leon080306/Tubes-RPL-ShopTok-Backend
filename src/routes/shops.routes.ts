import { Router } from "express";
import { ShopsController } from "../controllers/shops.controller";
import { createUploadMiddleware } from "../middlewares/upload.middleware";

const router: Router = Router();

const uploadShop = createUploadMiddleware("shops");

router.get("/", ShopsController.getAll);
router.get("/:id", ShopsController.getById);
router.get("/user/:userId", ShopsController.getByUserId);

router.post(
    "/",
    uploadShop.fields([
        { name: "profile_pic", maxCount: 1 },
        { name: "banner", maxCount: 1 },
    ]),
    ShopsController.create
);

// ← NEW: Update shop
router.put(
    "/:id",
    uploadShop.fields([
        { name: "profile_pic", maxCount: 1 },
        { name: "banner", maxCount: 1 },
    ]),
    ShopsController.update
);

export default router;