const User = require("./models/users");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use(
    new LocalStrategy({ usernameField: "login", passwordField: "password" }, async (login, password, done) => {
        try {
            const user = await User.findOne({ login: login });
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, { message: "Wrong login or password" });
            }
        }
        catch (err) {
            return done(null, false, { message: "Wrong login or password" });
        }
    })
);

module.exports = passport;