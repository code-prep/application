const express = require('express');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
const router = express.Router();
const {ensureAuthenticated} = require('../auth/auth');

// Load Question Model
require('../models/Question');
const Question = mongoose.model('questions');

// Questions Index Page (GET)
router.get('/', ensureAuthenticated, (req, res) => {
    // Only use user authorized Questions
    Question.find({user: req.user.id})
      .sort({date:'desc'})
      .then(questions => {
        res.render('questions/index', {
            headtitle: 'Questions',
            questions:questions,
            helpers: {
            grouped_each: function(every, context, options) {
                var out = "", subcontext = [], i;
                if (context && context.length > 0) {
                    for (i = 0; i < context.length; i++) {
                        if (i > 0 && i % every === 0) {
                            out += options.fn(subcontext);
                            subcontext = [];
                        }
                        subcontext.push(context[i]);
                    }
                    out += options.fn(subcontext);
                }
                return out;
            }}
        });
    });
});

// Add Question Form (GET)
router.get('/add', ensureAuthenticated, (req, res) => {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); 
    res.setHeader("Pragma", "no-cache"); 
    res.setHeader("Expires", "0");
    res.render('questions/add', {
        headtitle: 'Add a Question'
    });
});

module.exports = router;
