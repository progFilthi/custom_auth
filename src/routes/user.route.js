import { Router } from "express";
import userController from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.get("/", userController.getAllUsers);
userRouter.get("/:userId", userController.getUser);
userRouter.put("/:userId", userController.updateUser);
userRouter.delete("/:userId", userController.deleteUser);
userRouter.delete("/", userController.deleteAllUsers);

export default userRouter;
