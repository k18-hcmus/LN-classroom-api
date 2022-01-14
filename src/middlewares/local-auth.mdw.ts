import passport from "passport";
import passportLocal from "passport-local";
import User from "@schemas/user.schema";
import { get } from "lodash";
import { USER_ROLE } from "@shared/constants";

passport.use(
  new passportLocal.Strategy(
    {
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      try {
        const isAdmin = get(req, "body.isAdmin") || false;
        const user = await User.findOne({
          username: username,
          provider: "local",
          role: isAdmin ? USER_ROLE.ADMIN : USER_ROLE.MEMBER,
        }).exec();
        if (!user) {
          return done(null, false);
        }
        const isPasswordValid = user.comparePassword(password);
        if (isPasswordValid) {
          req.body.user = user;
          return done(null, user);
        }

        return done(null, false);
      } catch (err) {
        console.error(err);
        return done(err);
      }
    }
  )
);

export default passport.authenticate("local", { session: false });
