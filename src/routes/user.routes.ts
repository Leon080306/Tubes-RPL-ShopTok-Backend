import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const router: Router = Router();

router.get("/", UserController.getAll);
router.get("/:id", UserController.findById);
router.post("/", UserController.create);
router.put("/:id", UserController.update);
router.delete("/:id", UserController.remove);
router.put("/:id/change-password", UserController.changePassword);

export default router;