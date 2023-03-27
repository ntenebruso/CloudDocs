const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/User");

module.exports = function (passport) {
    passport.use(
        new LocalStrategy(function (username, password, done) {
            User.findOne({ username })
                .then((user) => {
                    if (!user) {
                        return done(null, false);
                    }

                    if (user.password !== password) {
                        return done(null, false);
                    }
                    console.log("success");
                    return done(null, user);
                })
                .catch((err) => {
                    return done(err);
                });
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });
};
