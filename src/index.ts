import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
//middlewares
app.use(cors());
app.use(express.json());

//simple health check route
app.get("/", (req, res) => {
  res.send("This is health check route...!");
});

import authRoute from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";

//api endpoint
app.use("/api/auth", authRoute);
app.use("/api/users", userRouter);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`The app is running on http://localhost:${port}`);
});
