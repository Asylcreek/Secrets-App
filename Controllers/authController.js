const passport = require('passport');
const User = require('../Models/userModel');

exports.signup = (req, res) => {
    const email = req.body.username;
    const password = req.body.password;
    const passwordConfirm = req.body.passwordConfirm;

    if (!email || !password || !passwordConfirm) {
        return res.render('register', { error: 'All fields are required' });
    }

    if (password !== passwordConfirm) {
        return res.render('register', {
            error: 'Password and confirm password are different. Please try again',
        });
    }

    User.register({ username: email, password }, password, function(err, user) {
        if (err) {
            console.log(err);
            return res.redirect('/register');
        }

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

        const user = await User.findOne({ username });

        if (!user)
            return res.render('login', {
                error: "Please <a class='btn-link' href='/register'>register</a> first.",
            });

        if (!(await user.correctPassword(password, user.password))) {
            error = 'Email or password mismatch';
            return res.render('login', { error });
        }

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