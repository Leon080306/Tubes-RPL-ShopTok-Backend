import { Router } from "express";
import { ShopsController } from "../controllers/shops.controller";
import { createUploadMiddleware } from "../middlewares/upload.middleware";

const router: Router = Router();

// upload khusus folder shops
const uploadShop = createUploadMiddleware("shops");

// GET all shops
router.get("/", ShopsController.getAll);

// GET shop by id
router.get("/:id", ShopsController.getById);

// CREATE shop (profile + banner)
router.post(
    "/",
    uploadShop.fields([
        { name: "profile_pic", maxCount: 1 },
        { name: "banner", maxCount: 1 }
    ]),
    ShopsController.create
);

router.get("/user/:userId", ShopsController.getByUserId);

export default router;