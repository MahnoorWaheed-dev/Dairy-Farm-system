const getLogin = (req, res) => {
    if (req.session.isLoggedIn) return res.redirect('/dashboard');
    res.render('login', { title: 'Login - Mangrio Shopping Centre' });
};

const postLogin = (req, res) => {
    const { username, password } = req.body;
    
    if (username === 'admin' && password === '123456') {
        req.session.isLoggedIn = true;
        req.session.user = { username: 'Admin', role: 'Owner' };
        return res.redirect('/dashboard');
    }

    res.render('login', { title: 'Login - Mangrio Shopping Centre' });
};

const getLogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
};

module.exports = {
    getLogin,
    postLogin,
    getLogout
};