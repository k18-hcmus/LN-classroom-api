import passport from "passport";
import passportLocal from "passport-local";
import User from "@schemas/user.schema";

passport.use(
  new passportLocal.Strategy(
    {
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      try {
        const user = await User.findOne({
          username: username,
          provider: "local",
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
