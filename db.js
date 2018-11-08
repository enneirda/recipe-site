// 1ST DRAFT DATA MODEL
const mongoose = require('mongoose');

// users
// * our site requires authentication...
// * so users have a username and password
// * they also can have 0 or more lists
const User = new mongoose.Schema({
  // username provided by authentication plugin
  // password hash provided by authentication plugin
  lists:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'List' }]
});

// A recipe in the database
// * includes the ingredients required from the items.

const Recipe = new mongoose.Schema({
  ingredients: {type: Array, required: true},
instructions: {type: Array}
}, {
  _id: true
});


// TODO: add remainder of setup for slugs, connection, registering models, etc. below

