const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const User = require('../Models/userModel');

exports.signup = async(req, res, next) => {
    try {
        const email = req.body.username;
        const password = req.body.password;
        const passwordConfirm = req.body.passwordConfirm;

        if (!email || !password || !passwordConfirm) {
            res.render('register', { error: 'All fields are required' });
            return next();
        }

        if (password !== passwordConfirm) {
            res.render('register', {
                error: 'Password and confirm password are different. Please try again',
            });
            return next();
        }

        // console.log(user);

        const newUser = await User.register({ username: email }, password);

        const { user } = await User.authenticate()(newUser.username, password);
        console.log(user);

        // res.redirect('/login');
        res.redirect('/secrets');

        next();
    } catch (err) {
        console.log(err);
    }
};

exports.login = async(req, res, next) => {
    try {
        const email = req.body.username;
        const password = req.body.password;

        const user = await User.findOne({ email });

        if (!(await user.correctPassword(password, user.password))) {
            error = 'Email or password mismatch';
            res.render('login', { error });

            return next();
        }

        res.redirect('/secrets');

        next();
    } catch (err) {
        console.log(err);
    }
};