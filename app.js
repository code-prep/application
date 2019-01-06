const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

// Init express
const app = express();

// ----------
// DataBase Configuration

// DB is selected based on production/development
const db = require('./config/keys').mongoURI;

// Map gloabl promise - gets rid of warning
mongoose.Promise = global.Promise;

// Connect to DB
mongoose.connect(db, {
    useNewUrlParser: true
})
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// ----------