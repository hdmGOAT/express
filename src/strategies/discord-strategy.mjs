import passport from "passport";
import { Strategy } from "passport-discord";
import dotenv from "dotenv";

dotenv.config();

passport.use(
  new Strategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CLIENT_REDIRECT,
      scope: ["identify", "guilds"],
    },
    (accessToken, refreshToken, profile) => {}
  )
);
