const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');
const FacebookStrategy = require('passport-facebook');

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
        // required: [true, 'Please provide a password'],
        minlength: [8, 'Your password should have more than 7 characters'],
        select: false,
    },
    googleId: String,
    facebookId: String,
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
userSchema.plugin(findOrCreate);

const User = mongoose.model('User', userSchema);

// use static createStrategy method of model
passport.use(User.createStrategy());

//Static serialize and deserialize methods for every possible strategy
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

//Google Strategy
passport.use(
    new GoogleStrategy({
            clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
            clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
            callbackURL: 'http://localhost:5000/auth/google/secrets',
        },

        function(accessToken, refreshToken, profile, cb) {
            const googleId = profile.id;
            const email = profile.emails[0].value;

            //Check if user exists
            User.findOne({ email }, function(err, user) {
                if (user) {
                    //Check if user doesn't have googleId
                    if (!user.googleId) {
                        User.findOneAndUpdate({ _id: user._id }, { googleId }, { new: true },
                            function(err, updatedUser) {
                                console.log(updatedUser);
                                return cb(err, updatedUser);
                            }
                        );
                        //If user has googleId
                    } else {
                        return cb(err, user);
                    }
                    //If user doesn't exist
                } else {
                    User.create({ googleId, email }, function(err, user) {
                        return cb(err, user);
                    });
                }
            });
        }
    )
);

//Facebook Strategy
passport.use(
    new FacebookStrategy({
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: 'http://localhost:5000/auth/facebook/secrets',
            profileFields: ['id', 'displayName', 'photos', 'email'],
        },
        function(accessToken, refreshToken, profile, cb) {
            const facebookId = profile.id;
            const email = profile.emails[0].value;

            //Check if user exists
            User.findOne({ email }, function(err, user) {
                if (user) {
                    //Check if user doesn't have facebookId
                    if (!user.facebookId) {
                        User.findOneAndUpdate({ _id: user._id }, { facebookId }, { new: true },
                            function(err, updatedUser) {
                                console.log(updatedUser);
                                return cb(err, updatedUser);
                            }
                        );
                        //If user has facebookId
                    } else {
                        return cb(err, user);
                    }
                    //If user doesn't exist
                } else {
                    User.create({ facebookId, email }, function(err, user) {
                        return cb(err, user);
                    });
                }
            });
        }
    )
);

module.exports = User;