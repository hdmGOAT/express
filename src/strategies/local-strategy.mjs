import passport from "passport";
import { Strategy } from "passport-local";
import { User } from "../mongoose/schemas/user.mjs";
import { hashPassword } from "../utils/helpers.mjs";

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const findUser = await User.findById(id);
    if (!findUser) throw new Error("User not found");
    done(null, findUser);
  } catch (err) {
    done(err, null);
  }
});

export default passport.use(
  new Strategy(async (username, password, done) => {
    password = hashPassword(password);
    console.log("Username: ", username);
    console.log("Password: ", password);
    try {
      const findUser = await User.findOne({ username });

      if (!findUser) throw new Error("user not found");
      if (findUser.password !== password) throw new Error("incorrect password");

      done(null, findUser);
    } catch (err) {
      done(err, null);
    }
  })
);
