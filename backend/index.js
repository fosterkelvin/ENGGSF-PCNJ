import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
dotenv.config();
import { userRouter } from "./routes/user.js";

const app = express();
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use("/auth", userRouter);

mongoose.connect(
  "mongodb+srv://enggsfpcnj:j910KsvJD8ss5nvM@pcnj.pbgm3.mongodb.net/pcnjDB"
);

app.listen(process.env.PORT, () => {
  console.log(`Server is running.`);
});
