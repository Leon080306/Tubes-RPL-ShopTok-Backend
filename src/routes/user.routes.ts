import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const router: Router = Router();

router.get("/", UserController.getAll);
router.get("/:id", UserController.findById);
router.post("/", UserController.create);
router.put("/:id", UserController.update);
router.delete("/users/:id", UserController.remove);

export default router;