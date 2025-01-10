import passport from "passport";
import { Strategy } from "passport-local";
import { mockUsers } from "../utils/constants.mjs";

passport.use(
  new Strategy((username, password, done) => {
    try {
      const findUser = mockUsers.find((user) => user.username === username);
      if (!findUser) throw new Error("user not found");
      if (findUser.password !== password) throw new Error("incorrect password");
    } catch (err) {}
  })
);
