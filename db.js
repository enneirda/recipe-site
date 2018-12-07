// 1ST DRAFT DATA MODEL
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// users
// * our site requires authentication...
// * so users have a username and password
// * they also can have 0 or more lists
const userSchema = new Schema({
    email: {type:String, required: true},
    username: {type:String, required: true},
  password: {type: String, required: true}
});

userSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

userSchema.methods.validatePassword = function(password) {
    return bcrypt.compare(password, hash, function(err, res) {
        // res === false
    });
};
// A recipe in the database
// * includes the ingredients required from the items.

const recipeSchema = new Schema({
    name: {type:String},
    ingredients: {type: Array, required: true},
    qtys: {type: Array},
    instructions: {type: Array},
    tags:{type: Array}
} );

// is the environment variable, NODE_ENV, set to PRODUCTION?
let dbconf;
if (process.env.NODE_ENV === 'PRODUCTION') {
    // if we're in PRODUCTION mode, then read the configration from a file
    // use blocking file io to do this...
    const fs = require('fs');
    const path = require('path');
    const fn = path.join(__dirname, 'config.json');
    const data = fs.readFileSync(fn);

    // our configuration file will be in json, so parse it and set the
    // conenction string appropriately!
    const conf = JSON.parse(data);
    dbconf = conf.dbconf;
} else {
    // if we're not in PRODUCTION mode, then use
    dbconf = 'mongodb://localhost/amb1248';
}

mongoose.model("User", userSchema)
mongoose.model("Recipe", recipeSchema)




mongoose.connect(dbconf);


// TODO: add remainder of setup for slugs, connection, registering models, etc. below


