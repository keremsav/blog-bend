const router = require('express').Router();
const passport = require('passport');
const User = require('../Models/User');
const isAuth = require('./authMiddleware').isAuth;
const isAdmin = require('./authMiddleware').isAdmin;
let passValidator = require('./authMiddleware').passValidator;
let validator = require('validator');
let bcrypt = require('bcrypt');
require('../config/passport')
let generateVerificationToken = require('../controllers/nodeMailer').generateVerificationToken;
let sendVerificationMail = require('../controllers/nodeMailer').SendVerificationMail;
let sendResetPassMail = require('../controllers/nodeMailer').sendResetPassMail;
/**
 * -------------- POST ROUTES ----------------
 */

router.post('/login', passport.authenticate('local', {
    usernameField: 'email',
    passwordField: 'password',
}), (req, res) => {
    // Authentication succeeded, send a custom response
    res.json({ success: true });
});

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
        const verificationToken = generateVerificationToken();

         const user = new User({
             username : req.body.username,
             password : hashed,
             email : req.body.email,
             verificationToken : verificationToken,
         });

         await user.save();
         await sendVerificationMail(user.email, verificationToken);

        res.status(201).send({user});
    } catch (error) {
        return res.status(400).send({ error: error });
    }

});

// Forgot Password
router.post('/forgot-password', async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email || !validator.isEmail(email)) {
            return res.json({ message: 'Invalid email address' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ message: 'User not found' });
        }

        let resetToken = generateVerificationToken();
        user.resetToken = resetToken;
        await user.save();

        await sendResetPassMail(user.email, resetToken);

        res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Reset Password
router.post('/reset-password', async (req, res, next) => {
    try {
        const { resetToken, password } = req.body;

        if (!resetToken || !password) {
            return res.status(400).json({ message: 'Invalid reset token or password' });
        }
        if(passValidator(password) !== true) {
            return res.json({ message: 'Password is to weak.' })
        }
        const user = await User.findOne({ resetToken });
        if (!user) {
            return res.status(400).json({ message: 'Invalid reset token' });
        }

        user.password = await bcrypt.hash(password, 10);
        user.resetToken = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});



/**
 * -------------- GET ROUTES ----------------
 */

// Render forgot password form
router.get('/forgot-password', (req, res, next) => {
    const form = '<h1>Forgot Password</h1><form method="POST" action="/forgot-password">\
    Enter Email:<br><input type="text" name="email">\
    <br><br><input type="submit" value="Submit"></form>';

    res.send(form);
});

// Render reset password form
router.get('/reset-password/:resetToken', async (req, res, next) => {
    try {
        const { resetToken } = req.params;

        const user = await User.findOne({ resetToken });
        if (!user) {
            return res.status(400).send('Invalid reset token');
        }

        const form = `<h1>Reset Password</h1>
      <form method="POST" action="/reset-password">
        <input type="hidden" name="resetToken" value="${resetToken}">
        Enter New Password:<br><input type="password" name="password">
        <br><br><input type="submit" value="Submit">
      </form>`;

        res.send(form);
    } catch (error) {
        return res.status(500).send('Internal server error');
    }
});

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

router.get('/protected-route', isAuth, (req, res, next) => {
    res.send('You made it to the route.');
});

router.get('/admin-route', isAdmin, (req, res, next) => {
    res.send('You made it to the admin route.');
});

// Visiting this route logs the user out
router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });

});

router.get('/login-success', (req, res, next) => {
    res.send('<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>');
});

router.get('/login-failure', (req, res, next) => {
    res.send('You entered the wrong password.');
});

router.get('/verify/:token', async (req, res, next) => {
    try {
        const { token } = req.params;
        const user = await User.findOne({ verificationToken: token });
        if (!user) {
            return res.status(400).send('Invalid token');
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();
        return res.send('Email verification successful! You can now <a href="/login">login</a>.');
    } catch (error) {
        return res.status(400).send({ error: error });
    }
});


module.exports = router;