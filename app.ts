/// <reference types="./types/global" />
import "module-alias/register";
import dotenv from "dotenv";
import express, { Application } from "express";
import passport from "passport";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import appRoute from "@/routes/applicationApi";
import coreRoute from "./routes/coreApi";
import authRouter from "@/routes/auth";

dotenv.config({ path: [".env.development", ".env"] });

// console.log(process.env.AUTH0_CLIENT_ID)

const app: Application = express();
const PORT = process.env.PORT || 3500;

export const prisma = new PrismaClient();

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(cors());
app.use(passport.initialize());

// Standard dev logging
app.use(morgan("tiny"));

// Custom log format with file stream
app.use(
  morgan(
    ':remote-addr - :remote-user log-time:- [:date[web]] METHOD:- ":method :url HTTP/:http-version" :status RESPONSE-TIME:- :res[content-length] - :response-time ms',
    { stream: accessLogStream }
  )
);


//Body parsing ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
// app.use(cookieParser());
// app.use(compression())

// application API ------
app.use("/api/v1", appRoute);

// core API ------
app.use("/api/v1/entity", coreRoute);

// Auth API ------
app.use("/", authRouter);

app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT} 🚀🚀`);
});
