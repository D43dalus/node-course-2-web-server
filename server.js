const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

// setting port for using the app with Heroku
const port = process.env.PORT || 3000;

// setting up express
var app = express();

//configuring to register partials
hbs.registerPartials(__dirname + '/views/partials');
//setting up hbs
app.set('view engine', 'hbs');

//registering middleware
app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;

    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to sever.log')
        }
    });
    next();
});

// //maintenance with no next() call - stays on this page regardless of calls
// app.use((req, res, next) => {
//     res.render('maintenance.hbs');
// });

//identifying absolute route to /public folder
app.use(express.static(__dirname + '/public'));

//registering helpers
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});
hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

//getting page for home root
app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: 'Welcome to my node.js rendered webpage',
    })
});

//getting page for about page
app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page'
    });
});

//gettign page for projects page
app.get('/projects', (req, res) => {
    res.render('projects.hbs', {
        pageTitle: 'My Projects'
    });
});

//getting page for bad page
app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'This page does not exist'
    });
});

//app listening on port3000 for actions from user
app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
