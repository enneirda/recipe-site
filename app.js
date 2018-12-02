const db = require('./db');

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Recipe = mongoose.model('Recipe');
let currentIngredients = [];

const app = express();

// enable sessions
const session = require('express-session');
const sessionOptions = {
    secret: 'secret cookie thang (store this elsewhere!)',
    resave: true,
    saveUninitialized: true,
    currentIngredients: [],
    newestRecipe: []

};
app.use(session(sessionOptions));

app.use(function(req, res, next){
    res.locals.currentIngredients = sessionOptions.currentIngredients;
    res.locals.newestRecipe = sessionOptions.newestRecipe;
    next();

});


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
    const name = req.body.name;
    let ingredients =[];
    let qtys = [];
    let instructions = [];
    let tags = req.body.tags.split(',');

    qtys.push(req.body.qty1 + ' ' + req.body.ingredient1);
    qtys.push(req.body.qty2 + ' ' + req.body.ingredient2);
    qtys.push(req.body.qty3 + ' ' + req.body.ingredient3);
    qtys.push(req.body.qty4 + ' ' + req.body.ingredient4);
    qtys.push(req.body.qty5 + ' ' + req.body.ingredient5);

    ingredients.push(req.body.ingredient1);
    ingredients.push(req.body.ingredient2);
    ingredients.push(req.body.ingredient3);
    ingredients.push(req.body.ingredient4);
    ingredients.push(req.body.ingredient5);



    instructions.push(req.body.instruction1);
    instructions.push(req.body.instruction2);
    instructions.push(req.body.instruction3);
    instructions.push(req.body.instruction4);
    instructions.push(req.body.instruction5);

    const newRecipe = {
        name: req.body.name,
        ingredients: ingredients,
        qtys: qtys,
        instructions: instructions,
        tags: tags,

    };
    res.locals.newestRecipe.push(newRecipe);
    console.log(res.locals.newestRecipe);


    new Recipe(newRecipe).save(function(err, sound, count){

        res.redirect('/showrecipe');

    });


});


app.get('/showrecipe', (req, res) => {
    console.log(res.locals.newestRecipe)
    res.render('show');
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

function filterIngredients(x){
    return (x!=='' );
}

app.post('/find', (req, res) => {
    console.log('got this body', req.body);

    const ingredients = req.body.ingredients.split(',');
    ingredients.filter(filterIngredients(x));
    ingredients.forEach(function(element)
    {
        res.locals.currentIngredients.push(element);
    });

    console.log(res.locals.currentIngredients);



    res.redirect('/find')

});

app.get('/find', (req, res) => {
    let filterObject = {};
    if (res.locals.currentIngredients.length !== 0){
        filterObject = {ingredients: res.locals.currentIngredients}
    }

    console.log(filterObject);

    Recipe.find(filterObject , function(err, result, count) {
        console.log("hi");
        const context = {
            result: result,
        };
        console.log(result);
        res.render('find', context);
    });





});



app.listen(process.env.PORT || 3000);


// this will be used to validate usernames and passwords (validate.js)

//from documentation
var constraints = {
    username: {
        presence: true,
        exclusion: {
            within: ["nicklas"],
            message: "'%{value}' is not allowed"
        }
    },
    password: {
        presence: true,
        length: {
            minimum: 6,
            message: "must be at least 6 characters"
        }
    }
};
