import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";
import UploadMiddleware from "../middlewares/upload.middleware";

const router: Router = Router();

router.get("/", CategoryController.getAll);
router.get("/:id", CategoryController.findById);
router.post("/", UploadMiddleware.single("icon"), CategoryController.create);
router.put("/:id", UploadMiddleware.single("icon"), CategoryController.update);
router.delete("/:id", CategoryController.remove);

export default router;