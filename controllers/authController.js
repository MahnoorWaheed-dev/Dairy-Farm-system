const User = require('../models/User');
const bcrypt = require('bcryptjs');


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
            success: 'Password reset successfully! You can now login.' 
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