import prisma from "../lib/lib.js";
import bcrypt from "bcrypt";

const userController = {
  getAllUsers: async () => {},
  signUp: async (req, res) => {
    try {
      const { first_name, last_name, user_name, email, password } = req.body;
      if (!first_name || !last_name || !email || !password || !user_name) {
        return res
          .status(400)
          .json({ message: "All the fields are required!" });
      }

      //check for an existing user!

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res
          .status(209)
          .json({ message: "User with the same email already exits" });
      }

      //we need to hash the password with bcrypt

      const hashedPassword = await bcrypt.hash(password, 10);

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
      res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal error while signing up" });
    }
  },
  signIn: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required!" });
      }
      const user = await prisma.user.findUnique({ where: { email } });
      if (!email) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      //we gonna add the JWT here later then send it back!!

      res.status(200).json({ message: "Login successful" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal server error while signing in" });
      console.error(error);
    }
  },
};

export default userController;
