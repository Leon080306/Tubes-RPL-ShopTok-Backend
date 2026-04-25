import { Router } from "express";
import { RatingsController } from "../controllers/RatingsController";
import { createUploadMiddleware } from "../middlewares/upload.middleware";

const router: Router = Router();
const uploadRating = createUploadMiddleware("ratings");

router.get("/", RatingsController.getAll);
// router.get("/:id", RatingsController.getById);
router.post("/", uploadRating.single("picture"), RatingsController.create);
// router.put("/:id",  RatingsController.update);
// router.delete("/:id",  RatingsController.delete);

export default router;