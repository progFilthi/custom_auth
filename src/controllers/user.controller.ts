import prisma from "../lib/lib";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Response, Request } from "express";

const userController = {
  //getAll Users Controller
  getAllUsers: async (req: Request, res: Response) => {
    try {
      const users = await prisma.user.findMany();
      if (!users)
        return res
          .status(400)
          .json({ message: "There are no signed users yet" });
      res.status(200).json({ users });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error when trying to GET all users",
      });
      console.error(error);
    }
  },
  //Get a single user controller
  getUser: async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) return res.status(404).json({ message: "User not found!" });
      res.status(200).json({ message: "User fetched successfully", user });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error when trying to GET a user by id",
      });
      console.error(error);
    }
  },
  updateUser: async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const { first_name, last_name, user_name, email, password } = req.body;

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          first_name,
          last_name,
          user_name,
          email,
          password: hashedPassword,
        },
      });
      // delete user.password;
      if (!user) return res.status(404).json({ message: "User not found" });
      res.status(200).json({ message: "User UPDATED succesfully", user });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error when trying to UPDATE a user by id",
      });
      console.error(error);
    }
  },
  //delete a user controller
  deleteUser: async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const user = await prisma.user.delete({ where: { id: userId } });
      if (!user) return res.status(404).json({ message: "user not found!" });
      res.status(200).json({ message: "User DELETED successfully", user });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error while trying to DELETE a user",
      });
      console.error(error);
    }
  },
  //deleting all users controller
  deleteAllUsers: async (req: Request, res: Response) => {
    try {
      const users = await prisma.user.deleteMany({});
      res.status(200).json({ message: "Users deleted successfully", users });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error while trying to DELETE all users",
      });
      console.error(error);
    }
  },
  //this is a sign up controller
  signUp: async (req: Request, res: Response) => {
    try {
      const { first_name, last_name, user_name, email, password } = req.body;
      if (!first_name || !last_name || !email || !password || !user_name) {
        return res
          .status(400)
          .json({ message: "All the fields are required!" });
      }

      //check for an existing user email!
      const existingEmail = await prisma.user.findUnique({
        where: { email },
      });
      if (existingEmail) {
        return res
          .status(409)
          .json({ message: "User with the same email already exits" });
      }

      //check for an existing user name!
      const existingUsername = await prisma.user.findUnique({
        where: { user_name },
      });
      if (existingUsername) {
        return res
          .status(409)
          .json({ message: "User with the same username already exits" });
      }

      //we need to hash the password with bcrypt

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await prisma.user.create({
        data: {
          first_name,
          last_name,
          user_name,
          email,
          password: hashedPassword,
        },
      });
      delete user.password;
      res.status(201).json({ message: "User CREATED successfully", user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal error while signing up" });
    }
  },
  //this is a sign in controller
  signIn: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required!" });
      }
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      //we gonna add the JWT here later then send it back!!
      const jwt_token = process.env.JWT_SECRET as string;
      const expires_in = process.env.JWT_EXPIRES_IN as string;
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        jwt_token,
        { expiresIn: expires_in }
      );

      //we only gonna need to verify the token
      // if (!token)
      //   return res
      //     .status(400)
      //     .json({ message: "invalid or no token provided" });

      res.status(200).json({ token, message: "Login successful" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal server error while signing in" });
      console.error(error);
    }
  },
};

export default userController;
