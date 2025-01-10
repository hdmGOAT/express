import passport from "passport";
import { Strategy } from "passport-local";
import { mockUsers } from "../utils/constants.mjs";

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  try {
    const findUser = mockUsers.find((user) => user.id === id);
    if (!findUser) throw new Error("User not found");
    done(null, findUser);
  } catch (err) {
    done(err, null);
  }
});

export default passport.use(
  new Strategy((username, password, done) => {
    console.log("Username: ", username);
    console.log("Password: ", password);
    try {
      const findUser = mockUsers.find((user) => user.username === username);

      if (!findUser) throw new Error("user not found");
      if (findUser.password !== password) throw new Error("incorrect password");

      done(null, findUser);
    } catch (err) {
      done(err, null);
    }
  })
);
