exports.renderHomePage = (req, res) => {
    res.render('home');
};

exports.renderLogin = (req, res) => {
    res.render('login', { error: null });
};

exports.renderRegister = (req, res) => {
    res.render('register', { error: null });
};

exports.renderSecrets = (req, res) => {
    if (req.isAuthenticated()) {
        return res.render('secrets');
    }

    res.redirect('/login');
};

exports.logout = (req, res) => {
    req.logout();
    res.redirect('/');
};