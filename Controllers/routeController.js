const mongoose = require('mongoose');
const User = require('../Models/userModel');
const Secret = require('../Models/secretModel');

exports.renderHomePage = (req, res) => {
    res.render('home');
};

exports.renderLogin = (req, res) => {
    res.render('login', { error: null });
};

exports.renderRegister = (req, res) => {
    res.render('register', { error: null });
};

exports.renderSecrets = async(req, res) => {
    if (req.isAuthenticated()) {
        const secrets = await Secret.find();
        return res.render('secrets', { secrets });
    }

    res.redirect('/login');
};

exports.logout = (req, res) => {
    req.logout();
    res.redirect('/');
};

exports.submit = (req, res) => {
    if (req.isAuthenticated()) {
        return res.render('submit', { error: null });
    }

    res.redirect('/login');
};

exports.createSecret = async(req, res, next) => {
    const secret = req.body.secret;
    let user = req.user;

    //Check if user added a secret
    if (!secret) return res.render('submit', { error: 'Please enter a secret' });

    //Create the secret document
    const newSecret = await Secret.create({
        _id: new mongoose.Types.ObjectId(),
        secret,
    });

    //Add the secret to the user's secrets
    user = await User.findOneAndUpdate({ _id: user._id }, { $push: { secrets: newSecret._id } });

    // user = await User.findOne({ _id: user._id }).populate('secrets');
    // console.log(user);

    res.redirect('/secrets');
};