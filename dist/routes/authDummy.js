"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const express_1 = require("express");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_jwt_1 = __importDefault(require("passport-jwt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authRouter = (0, express_1.Router)();
// google auth configuration
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
}, (accessToken, refreshToken, profile, done) => {
    // Here you can save the user profile to your database
    return done(null, profile);
}));
passport_1.default.use(new passport_jwt_1.default.Strategy({
    jwtFromRequest: passport_jwt_1.default.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || "ihriehge565ijiibf",
}, (payload, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log(payload);
        // Find user by ID from JWT payload
        const user = { usr: 1, name: "Panchanan" };
        if (user) {
            return done(null, user);
        }
        return done(null, false, { message: "User not found" });
    }
    catch (error) {
        return done(error, false, { message: "User not found" });
    }
})));
authRouter.get("/auth/google", (req, res, next) => {
    const redirectUrl = req.query.redirect;
    const state = Buffer.from(JSON.stringify({
        redirectUrl,
        timestamp: Date.now(),
    })).toString("base64");
    passport_1.default.authenticate("google", {
        scope: ["profile", "email"],
        prompt: "consent",
        state: state,
    })(req, res, next);
});
authRouter.get("/auth/google/callback", (req, res, next) => {
    passport_1.default.authenticate("google", {
        failureRedirect: "/login",
        session: false,
    }, function (err, user, info) {
        const state = JSON.parse(Buffer.from(req.query.state, "base64").toString());
        console.log(state);
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.emails[0].value }, process.env.JWT_SECRET || "ihriehge565ijiibf", { expiresIn: "1h" });
        // Successful authentication, redirect home.
        // res.send({token: token, user: req.user} );
        res.redirect("/user");
    })(req, res, next);
});
// const authenticateJWT = passport.authenticate('jwt', { session: false });
authRouter.get("/user", (req, res) => {
    res.send({ msg: "Welcome to our APP" });
});
exports.default = authRouter;
