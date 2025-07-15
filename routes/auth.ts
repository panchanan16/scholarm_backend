import passport from "passport";
import { Router } from "express";
import { Strategy } from "passport-google-oauth20";
import passportJWT from "passport-jwt";
import jwt from "jsonwebtoken";
import { authenticateJWT } from "@/middleware/verifyUserRoute";

const authRouter = Router();

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

authRouter.get("/auth/google", (req, res, next) => {
  const redirectUrl = req.query.redirect;

  const state = Buffer.from(
    JSON.stringify({
      redirectUrl,
      timestamp: Date.now(),
    })
  ).toString("base64");

  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "consent",
    state: state,
  })(req, res, next);
});

authRouter.get("/auth/google/callback", (req: any, res, next) => {
  passport.authenticate(
    "google",
    {
      failureRedirect: "/login",
      session: false,
    },
    function (err, user, info) {
      const state = JSON.parse(
        Buffer.from(req.query.state, "base64").toString()
      );
      console.log(state);
      const token = jwt.sign(
        { id: user.id, email: user.emails[0].value },
        process.env.JWT_SECRET || "ihriehge565ijiibf",
        { expiresIn: "1h" }
      );
      // Successful authentication, redirect home.
      // res.send({token: token, user: req.user} );
      res.redirect("/user");
    }
  )(req, res, next);
});

// const authenticateJWT = passport.authenticate('jwt', { session: false });
authRouter.get("/user", (req, res) => {
  res.send({ msg: "Welcome to our APP" });
});

export default authRouter;
