const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

// Load User Model
require('../models/User');
const User = mongoose.model('users');

// User Login route (get)
router.get('/login', (req, res) => {
    res.render('users/login', {
        headtitle: 'Login'
    })
});

// Login Form (POST)
// This request is handled by passport 'local' authentication
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true,
    })(req, res, next);
});

// User Register route (get)
router.get('/register', (req, res) => {
    res.render('users/register', {
        headtitle: 'Register'
    })
});

// Register Form (POST)
router.post('/register', (req, res) => {
    // Catch errors in an array to display
    let errors = [];

    // Same password check
    if (req.body.password != req.body.password2) {
        errors.push({ text: 'Passwords do not match' });
    }

    // Password length check
    if (req.body.password.length < 6) {
        errors.push({ text: 'Password must be at least 6 characters' });
    };

    // Error catch
    if (errors.length > 0) {
        res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        });
    } else {
        // Duplicate email catch
        User.findOne({ email: req.body.email })
            .then(user => {
                if (user) {
                    req.flash('error_msg', 'Email is already registered');
                    res.redirect('/users/register');
                } else {
                    // All checks passed
                    // Create new user
                    const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password
                    });
                    // Encrypt password using bcrypt
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            // Save as 'User' object in DB
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', "Registration sucessful, you can now login");
                                    res.redirect('/users/login');
                                })
                                .catch(err => {
                                    console.log(err);
                                    return;
                                })
                        });
                    });
                }
            })
    }
});

// User Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You have successfully logged out');
    res.redirect('/users/login');
});

module.exports = router;