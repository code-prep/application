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

// Add Question (POST)
router.post('/', ensureAuthenticated, (req, res) => {
    // Error Catch
    let errors = [];

    // Server side check 
    if(!req.body.question){
        errors.push({text:'Please add a question'});
    }

    // Server side check 
    if(!req.body.description){
        errors.push({text:'Please add a description'});
    }

    // Server side validation 
    if(errors.length > 0){
        res.render('questions/add', {
            errors: errors,
            question: req.body.question
        });
    } else {
        // Add new question
        const newUser = {
            question: req.body.question,
            description: req.body.description,
            difficulty: req.body.difficulty,
            user: req.user.id
        }
        // Save in DB
        new Question(newUser).save()
            .then(question => {
                req.flash('success_msg', 'Question added!');
                res.redirect('/questions');
            })
    }
});

// Edit Question Page (GET)
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Question.findOne({
        _id: req.params.id
    })
    .then(question => {
        // Check if question exists
        if(question.user != req.user.id) {
            req.flash('error_msg', 'Not Authorized');
            res.redirect('/questions');
        } else {
            res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); 
            res.setHeader("Pragma", "no-cache"); 
            res.setHeader("Expires", "0");
            res.render('questions/edit', {
                headtitle: 'Edit a Question',
                question: question
            });
        }
        
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
