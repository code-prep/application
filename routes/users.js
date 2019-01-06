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

module.exports = router;