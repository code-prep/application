const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
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
// Dependencies Middleware Config

// Express-Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));


// ----------
// Node Routes

// Index route (landing page)
app.get('/', (req, res) => {
    res.render('index', { layout: false });
});

// Dashboard route
app.get('/dashboard', (req, res) => {
    res.render('dashboard', {
        headtitle: 'Dashboard'
    });
})

// About route
app.get('/about', (req, res) => {
    res.render('about', {
        headtitle: 'About'
    });
});

// ----------
// App Listen Port

// Use routes (anything starting with /users or /questions)
app.use('/users', users);
app.use('/questions', questions);

// Local Host Port
const port = 5000;

// Starts listening for server
app.listen(port, (req, res) => {
    console.log(`Server started on port ${port}...`);
});
