const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/User");

module.exports = function(passport) {
    passport.use(new LocalStrategy(
        function(username, password, done) {
            User.findOne({ username }, (err, user) => {
                if (err) return done(err);
                if (!user) {
                    return done(null, false);
                }
                if (user.password !== password) {
                    return done(null, false);
                }
                return done(null, user);
            })
        }
    ));
    passport.serializeUser((user, done) => {
        done(null, user);
    });
    passport.deserializeUser((user, done) => {
        done(null, user);
    });
}