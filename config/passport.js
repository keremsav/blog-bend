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
    (email, password, done) => {

    User.findOne({ email: email })
        .then( user => {
            if (!user) { return done(null, false) }
            const isValid = bcrypt.compare(password, user.password).then(function(result) {
                console.log(result)
               return result;
            });

            if (isValid === true) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        })
        .catch((err) => {
            done(err);
        });

}));

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