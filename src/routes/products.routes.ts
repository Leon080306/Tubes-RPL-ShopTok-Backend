import { Router } from "express";
import { ProductsController } from "../controllers/ProductsController";
import { createUploadMiddleware } from "../middlewares/upload.middleware";

const router: Router = Router();

// 🔥 instance khusus products
const uploadProduct = createUploadMiddleware("products");

router.post(
    "/",
    uploadProduct.array("variant_images"),
    ProductsController.create
);

// GET all products
router.get("/", ProductsController.getAll);

// GET product by id
router.get("/:id", ProductsController.getById);

router.put("/:id", uploadProduct.array("variant_images"), ProductsController.update);

router.delete("/:id", ProductsController.delete);

export default router;