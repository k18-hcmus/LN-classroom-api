import { UserModel } from "@models/user.model";
import User from "@schemas/user.schema";
import * as userService from "@services/user.service";
import { get } from "lodash";
import passport from "passport"
import passportGoogle from "passport-google-oauth20"

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user: UserModel, done) {
    done(null, user);
});

passport.use(new passportGoogle.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true
},
    async function (req, accessToken, _, profile, done) {
        try {
            const email = get(profile, 'emails[0].value')
            let user = await User.findOne({ email, provider: 'google' }).exec()
            if (!user) {
                user = await userService.createUser({
                    firstName: profile.name?.givenName || " ",
                    lastName: profile.name?.familyName || " ",
                    username: email,
                    email: email,
                    password: accessToken,
                    provider: 'google'
                } as UserModel)
            }
            req.body.user = user
            return done(null, user);
        } catch (err: any) {
            console.error(err)
            return done(err);
        }
    }
));

export default ((opts: passportGoogle.AuthenticateOptionsGoogle) => passport.authenticate('google', opts));