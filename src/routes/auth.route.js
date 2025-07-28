import { Router } from "express";
import userController from "../controllers/user.controller.js";

const authRouter = Router();

authRouter.post("/sign-in", userController.signIn);

authRouter.post("/sign-up", userController.signUp);

export default authRouter;
