const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../Models/User')
const crypto = require('crypto');
let bcrypt = require('bcrypt');

 async function genPassword(password) {
     const hash = await bcrypt.hash(password, 10);
     console.log('this is hash '+ hash);
    return hash;
}


passport.use(new LocalStrategy({
    usernameField : 'email',
    passwordField: 'password'
    },
    async (email, password, done) => {
        try {
            const user = await User.findOne({ email: email });
            if (!user) {
                return done(null, false);
            }
            const isValid = await bcrypt.compare(password, user.password);
            if (isValid) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (err) {
            return done(err);
        }
    }
));

passport.serializeUser((user, done) => {
    try {
        done(null, user.id);
    } catch (err) {
        done(err);
    }
});

passport.deserializeUser(async (userId, done) => {
    try {
        User.findById(userId)
            .then((user) => {
                done(null, user);
            })
            .catch(err => done(err))
    } catch (err) {
        done(err)
    }
});

module.exports = passport;
module.exports = genPassword;