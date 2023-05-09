const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../Models/User')
const crypto = require('crypto');
let bcrypt = require('bcrypt');

 async function genPassword(password) {
     const hash = await bcrypt.hash(password, 10);
     console.log('this is hash '+ hash);
    return hash;
}

const customFields = {
    emailField: 'email',
    passwordField: 'password'
};

const verifyCallback = (email, password, done) => {
    User.findOne({ email: email })
        .then((user) => {

            if (!user) { return done(null, false) }
            const isValid = bcrypt.compare(password,user.password);
            if (isValid) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        })
        .catch((err) => {
            done(err);
        });

}

const strategy  = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, user.id);
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

module.exports = genPassword;