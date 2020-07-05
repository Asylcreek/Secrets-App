exports.renderHomePage = (req, res, next) => {
    res.render('home');
};

exports.renderLogin = (req, res, next) => {
    res.render('login', { error: null });
};

exports.renderRegister = (req, res, next) => {
    res.render('register', { error: null });
};

exports.renderSecrets = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect('/secrets');
    }
    res.redirect('/login');
    next();
};