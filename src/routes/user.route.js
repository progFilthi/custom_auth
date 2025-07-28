import { Router } from "express";
import userController from "../controllers/user.controller.js";

const router = Router();

router.post("/sign-in", userController.signIn);

router.post("/sign-up", userController.signUp);

router.get("/users", userController.getAllUsers);

export default router;
