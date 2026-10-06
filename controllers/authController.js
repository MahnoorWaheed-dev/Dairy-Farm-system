const User = require('../models/User');
const bcrypt = require('bcryptjs');

const getLogin = (req, res) => {
    if (req.session && req.session.isLoggedIn) return res.redirect('/dashboard');
    res.render('login', { title: 'Login - Mangrio Shopping Centre', error: null });
};

// ✅ FIXED: Ab ye Database aur Reset hue Naye Hashed Password se check karega
const postLogin = async (req, res) => {
    try {
        let { username, password } = req.body;
        username = username ? username.trim() : '';

        if (!username || !password) {
            return res.render('login', { 
                title: 'Login - Mangrio Shopping Centre', 
                error: 'Please enter username and password!' 
            });
        }

        // 1. Database se User dhoondein
        const user = await User.findOne({ username: username });

        if (!user) {
            return res.render('login', { 
                title: 'Login - Mangrio Shopping Centre', 
                error: 'Invalid username or password!' 
            });
        }

        // 2. Naya Reset Password DB ke Hashed Password se Verify karein
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.render('login', { 
                title: 'Login - Mangrio Shopping Centre', 
                error: 'Invalid username or password!' 
            });
        }

        // 3. Match hone par Session Start karein
        req.session.isLoggedIn = true;
        req.session.user = { 
            id: user._id, 
            username: user.username, 
            role: user.role 
        };

        return res.redirect('/dashboard');

    } catch (err) {
        console.error('Login Error:', err);
        return res.render('login', { 
            title: 'Login - Mangrio Shopping Centre', 
            error: 'Server error during login.' 
        });
    }
};

const getLogout = (req, res) => {
    if (req.session) {
        req.session.destroy(() => {
            res.redirect('/login');
        });
    } else {
        res.redirect('/login');
    }
};

// 1. Render Forgot Password Page
const getForgotPassword = (req, res) => {
    res.render('forgotPassword', { 
        error: null, 
        success: null 
    });
};

// 2. Process Password Reset
const postForgotPassword = async (req, res) => {
    try {
        let { username, newPassword, confirmPassword } = req.body;
        username = username ? username.trim() : '';

        // Validation 1: Blank fields
        if (!username || !newPassword || !confirmPassword) {
            return res.render('forgotPassword', { 
                error: 'Please fill in all fields!', 
                success: null 
            });
        }

        // Validation 2: Passwords match
        if (newPassword !== confirmPassword) {
            return res.render('forgotPassword', { 
                error: 'New passwords do not match!', 
                success: null 
            });
        }

        // Find User
        const user = await User.findOne({ username: username });

        if (!user) {
            return res.render('forgotPassword', { 
                error: 'Username not found in DB!', 
                success: null 
            });
        }

        // Hash and Save
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        // Direct success response pass karein
        return res.render('forgotPassword', { 
            error: null, 
            success: 'Password reset successfully! You can now login with your new password.' 
        });

    } catch (err) {
        console.error('Reset error:', err);
        return res.render('forgotPassword', { 
            error: 'Server error, please try again.', 
            success: null 
        });
    }
};

module.exports = {
    getLogin,
    postLogin,
    getLogout,
    getForgotPassword,
    postForgotPassword
};