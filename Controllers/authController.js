const passport = require('passport');

const User = require('../Models/userModel');

exports.signup = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const passwordConfirm = req.body.passwordConfirm;

    if (!username || !password || !passwordConfirm) {
        return res.render('register', { error: 'All fields are required' });
    }

    if (password !== passwordConfirm) {
        return res.render('register', {
            error: 'Password and confirm password are different. Please try again',
        });
    }

    //Add the user to the database
    User.register({ username, email: username, password }, password, function(
        err,
        user
    ) {
        if (err) {
            console.log(err);
            return res.redirect('/register');
        }

        //If no error, authenticate user
        passport.authenticate('local')(req, res, function() {
            res.redirect('/secrets');
        });
    });
};

exports.login = async(req, res, next) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        if (!username || !password)
            return res.render('login', { error: 'Both fields are required' });

        const user = await User.findOne({ username }).select('+password');

        if (!user)
            return res.render('login', {
                error: "Please <a class='btn-link' href='/register'>register</a> first.",
            });

        //Check if password entered corresponds with password in database
        if (!(await user.correctPassword(password, user.password))) {
            error = 'Email or password mismatch';
            return res.render('login', { error });
        }

        //Log the user in
        req.login(user, function(err) {
            if (err) {
                console.log(err);
                return next(err);
            }
            res.redirect('/secrets');
        });
    } catch (err) {
        console.log(err);
    }
};

exports.googleLogin = passport.authenticate('google', {
    scope: ['profile', 'email'],
});

exports.googleLoginSuccess = (req, res) => {
    res.redirect('/secrets');
};

exports.facebookLogin = passport.authenticate('facebook', {
    scope: ['email'],
});

exports.facebookLoginSuccess = (req, res) => {
    res.redirect('/secrets');
};