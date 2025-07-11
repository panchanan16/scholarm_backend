/// <reference types="./types/global" />
import "module-alias/register";
import dotenv from "dotenv";
import express, { Application } from "express";
import { Strategy } from "passport-google-oauth20";
import passportJWT from "passport-jwt";
import jwt from "jsonwebtoken";
import passport from "passport";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import appRoute from "@/routes/applicationApi";
import coreRoute from "./routes/coreApi";
import authRouter from "@/routes/auth";
import { config } from "./config/auth.config";
import { authenticateJWT } from "./middleware/verifyUserRoute";

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

// Standard dev logging
app.use(morgan("tiny"));

// Custom log format with file stream
app.use(
  morgan(
    ':remote-addr - :remote-user log-time:- [:date[web]] METHOD:- ":method :url HTTP/:http-version" :status RESPONSE-TIME:- :res[content-length] - :response-time ms',
    { stream: accessLogStream }
  )
);

// google auth configuration
passport.use(
  new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // Here you can save the user profile to your database
      return done(null, profile);
    }
  )
);

passport.use(
  new passportJWT.Strategy(
    {
      jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || "ihriehge565ijiibf",
    },
    async (payload, done) => {
      try {
        // console.log(payload);
        // Find user by ID from JWT payload
        const user = { usr: 1, name: "Panchanan" };
        if (user) {
          return done(null, user);
        }
        return done(null, false, { message: "User not found" });
      } catch (error) {
        return done(error, false, { message: "User not found" });
      }
    }
  )
);

app.use(passport.initialize());

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "consent",
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  function (req: any, res) {
    const token = jwt.sign(
      { id: req.user.id, email: req.user.emails[0].value },
      process.env.JWT_SECRET || "ihriehge565ijiibf",
      { expiresIn: "1h" }
    );
    // Successful authentication, redirect home.
    res.send({token: token, user: req.user} );
  }
);

// const authenticateJWT = passport.authenticate('jwt', { session: false });
app.get("/user", authenticateJWT, (req, res) => {
  res.send({ msg: "Welcome to our APP" });
});

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
