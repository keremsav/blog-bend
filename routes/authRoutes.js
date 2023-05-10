const router = require('express').Router();
const passport = require('passport');
const User = require('../Models/User');
const isAuth = require('./authMiddleware').isAuth;
const isAdmin = require('./authMiddleware').isAdmin;
let passValidator = require('./authMiddleware').passValidator;
let validator = require('validator');
let bcrypt = require('bcrypt');
require('../config/passport')
/**
 * -------------- POST ROUTES ----------------
 */

router.post('/login', passport.authenticate('local', { successRedirect: 'login-success' }));

router.post('/register', async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.redirect('/register')
        }
        if(validator.isEmail(email) !== true ) {
            return res.json({ message: 'This is not an email address' })
        }
        if(passValidator(password) !== true) {
            return res.json({ message: 'Password is to weak.' })
        }
        //Check if the user already exist or not
        const userExist = await User.findOne({ email: req.body.email });
        if (userExist) {
            return res.json({ message: 'User already exist with the given emailId' })
        }
         let hashed = await bcrypt.hash(password, 10);
         console.log(hashed)
         const user = new User({
             username : req.body.username,
             password : hashed,
             email : req.body.email,
         });
         await user.save();

        res.status(201).send({user});
    } catch (error) {
        return res.status(400).send({ error: error });
    }

});


/**
 * -------------- GET ROUTES ----------------
 */

router.get('/', (req, res, next) => {
    res.send('<h1>Home</h1><p>Please <a href="/register">register</a></p>');
});

// When you visit http://localhost:3000/login, you will see "Login Page"
router.get('/login', (req, res, next) => {

    /*const form = '<h1>Login Page</h1><form method="POST" action="/login">\
    Enter Email:<br><input type="text" name="email">\
    <br>Enter Password:<br><input type="password" name="password">\
    <br><br><input type="submit" value="Submit"></form>';*/
    let form = '<h1>Sign in</h1>\n' +
        '<form action="/login" method="post">\n' +
        '    <section>\n' +
        '        <label for="email">Email</label>\n' +
        '        <input id="email" name="email" type="text" autocomplete="email" required autofocus>\n' +
        '    </section>\n' +
        '    <section>\n' +
        '        <label for="current-password">Password</label>\n' +
        '        <input id="current-password" name="password" type="password" autocomplete="current-password" required>\n' +
        '    </section>\n' +
        '    <button type="submit">Sign in</button>\n' +
        '</form>'

    res.send(form);

});

// When you visit http://localhost:3000/register, you will see "Register Page"
router.get('/register', (req, res, next) => {

    const form = '<h1>Register Page</h1><form method="POST" action="/register">\
                    Enter Username:<br><input type="text" name="username">\
                    <br>Enter Email:<br><input type="text" name ="email">\
                    <br>Enter Password:<br><input type="password" name="password">\
                    <br><br><input type="submit" value="Submit"></form>';

    res.send(form);

});

/**
 * Lookup how to authenticate users on routes with Local Strategy
 * Google Search: "How to use Express Passport Local Strategy"
 *
 * Also, look up what behaviour express session has without a maxage set
 */
router.get('/protected-route', isAuth, (req, res, next) => {
    res.send('You made it to the route.');
});

router.get('/admin-route', isAdmin, (req, res, next) => {
    res.send('You made it to the admin route.');
});

// Visiting this route logs the user out
router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/protected-route');
});

router.get('/login-success', (req, res, next) => {
    res.send('<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>');
});

router.get('/login-failure', (req, res, next) => {
    res.send('You entered the wrong password.');
});

module.exports = router;