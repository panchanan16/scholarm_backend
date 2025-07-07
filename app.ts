/// <reference types="./types/global" />
import "module-alias/register"
import express, { Application } from "express";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import appRoute from "@/routes/applicationApi";

const app: Application = express();
const PORT = process.env.PORT || 3500;

export const prisma = new PrismaClient();

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

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
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
// app.use(cookieParser());
// app.use(compression())

// application API ------
app.use("/api/v1", appRoute);

app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT} 🚀🚀`);
});
