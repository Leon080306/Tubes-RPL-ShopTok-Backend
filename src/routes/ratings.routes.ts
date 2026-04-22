import { Router } from "express";
import { RatingsController } from "../controllers/RatingsController";

const router: Router = Router();

router.get("/", RatingsController.getAll);
// router.get("/:id", RatingsController.getById);
// router.post("/", RatingsController.create);
// router.put("/:id",  RatingsController.update);
// router.delete("/:id",  RatingsController.delete);

export default router;