const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema;

// Create Schema
const QuestionSchema = new Schema({
  question:{
    type: String,
    required: true
  },
  description:{
    type: String,
    required: true
  },
  difficulty:{
    type: String,
    required: true,
    enum: ['easy', 'medium', 'hard']
},
  user:{
    type: String,
    required: true
  },
  strdate: {
    type: String,
    default: () => moment().format("MMMM Do YYYY")
  },
  date: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('questions', QuestionSchema);