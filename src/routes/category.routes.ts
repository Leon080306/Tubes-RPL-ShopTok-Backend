import { NextFunction, Router } from "express";
import { CategoryController } from "../controllers/category.controller";
import { createUploadMiddleware } from "../middlewares/upload.middleware";

const router: Router = Router();

// category.routes.ts
const UPLOAD_FOLDER = "categories";
const uploadCategory = createUploadMiddleware(UPLOAD_FOLDER);

// Attach folder name to req so the controller can use it
const attachFolder = (req: Request, _res: Response, next: NextFunction) => {
    (req as any).uploadFolder = UPLOAD_FOLDER;
    next();
};

router.post(
    "/",
    (req, _res, next) => { (req as any).uploadFolder = UPLOAD_FOLDER; next(); },
    uploadCategory.single("icon"),
    CategoryController.create
);

router.put(
    "/:id",
    (req, _res, next) => { (req as any).uploadFolder = UPLOAD_FOLDER; next(); },
    uploadCategory.single("icon"),
    CategoryController.update
);

router.get("/", CategoryController.getAll);
router.get("/:id", CategoryController.findById);

router.delete("/:id", CategoryController.remove);

export default router;