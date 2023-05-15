module.exports.isAuth = (req, res, next) => {
    try {
        if (req.isAuthenticated()) {
            next();
        } else {
            res.status(401).json({ msg: 'You are not authorized to view this resource' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'An unexpected error occurred' });
    }
}

module.exports.isAdmin = (req, res, next) => {
    try {
        if (req.isAuthenticated() && req.user.admin) {
            next();
        } else {
            res.status(401).json({ msg: 'You are not authorized to view this resource because you are not an admin.' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'An unexpected error occurred' });
    }
}


module.exports.passValidator = (password) => {
        let minMaxLength = /^[\s\S]{8,32}$/;
        let upper = /[A-Z]/;
        let lower = /[a-z]/;
        let number = /[0-9]/;

        if (minMaxLength.test(password) && upper.test(password) &&
            lower.test(password) && number.test(password)
        ) {
            return true;
        }
        return false;

}