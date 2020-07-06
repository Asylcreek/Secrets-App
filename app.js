//Require all necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');

const ejs = require('ejs');

const User = require('./Models/userModel');

const homeRouter = require('./Routes/homeRoute');
const loginRouter = require('./Routes/loginRoute');
const registerRouter = require('./Routes/registerRoute');

//Initialize express
const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

//Express Session Middleware
// app.set('trust proxy', 1); // trust first proxy
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        // cookie: { secure: true },
    })
);

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Mounted Routers
app.use('/', homeRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);

module.exports = app;