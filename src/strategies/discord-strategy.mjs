import passport from "passport";
import { Strategy } from "passport-discord";
import dotenv from "dotenv";
import { DiscordUser } from "../mongoose/schemas/discord-user.mjs";

dotenv.config();

export default passport.use(
  new Strategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CLIENT_REDIRECT,
      scope: ["identify"],
    },
    async (accessToken, refreshToken, profile, done) => {
      const findUser = await DiscordUser.findOne({ discordId: profile.id });
      if (!findUser) {
        const newUser = new DiscordUser({
          username: profile.username,
          discordId: profile.id,
        });
        const newSavedUser = await newUser.save();
        done(null, newSavedUser);
      }
    }
  )
);
