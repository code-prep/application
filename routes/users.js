const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Load User Model
require('../models/User');
const User = mongoose.model('users');

module.exports = router;