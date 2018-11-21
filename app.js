require('./db');

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Recipe = mongoose.model('Recipe');


const app = express();

// enable sessions
const session = require('express-session');
const sessionOptions = {
    secret: 'secret cookie thang (store this elsewhere!)',
    resave: true,
      saveUninitialized: true
};
app.use(session(sessionOptions));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// body parser setup
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index');
});


app.post('/create', (req, res) => {
    console.log('got this body', req.body);

    const newRecipe = {
        ingredients: req.body.ingredients,

        instructions: req.body.instructions,

    };
    new Recipe(newRecipe).save(function(err, sound, count){
        res.redirect('/');

    });


});

app.get('/create', (req, res) => {
    Recipe.find({} , function(err, result, count) {
        console.log("hi");
        const context = {
            result: result,
        };
        console.log(result);
        //res.render('test', context);
    });

    res.render('create');

});


app.listen(process.env.PORT || 3000);