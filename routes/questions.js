const express = require('express');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
const router = express.Router();
const {ensureAuthenticated} = require('../auth/auth');
