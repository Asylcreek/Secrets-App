const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please provide your email address'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid email address'],
    },
    username: String,
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [8, 'Your password should have more than 7 characters'],
        select: false,
    },
    dateCreated: Date,
});

userSchema.pre('save', function(next) {
    this.dateCreated = Date.now();

    next();
});

userSchema.pre('save', async function(next) {
    //Check if password has been hashed
    if (!this.isModified('password')) return next();

    //Hash password
    this.password = await bcrypt.hash(this.password, 12);

    next();
});

userSchema.methods.correctPassword = async function(
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

// use static createStrategy method of model
passport.use(User.createStrategy());

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.exports = User;