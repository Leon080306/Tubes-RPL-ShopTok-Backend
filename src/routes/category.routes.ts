import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";

const router: Router = Router();

router.get("/", CategoryController.getAll);
router.get("/:id", CategoryController.findById);
router.post("/", CategoryController.create);
router.put("/:id", CategoryController.update);
router.delete("/:id", CategoryController.remove);

export default router;