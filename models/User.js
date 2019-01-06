// Model names are always capitalized
const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema;

// Creating a User Schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: String,
        // formats the string for the dashboard
        default: () => moment().format("MMMM Do YYYY")
    }
});

// Saved as 'users'
mongoose.model('users', UserSchema);