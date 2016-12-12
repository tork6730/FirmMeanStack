// BASIC SET UP FOR AUTHENTICATION USERADMIN

var express       = require('express');
var app           = express();
var bodyParser    = require('body-parser');
var multer        = require('multer'); 
var passport      = require('passport');
var cookieParser  = require('cookie-parser');
var session       = require('express-session');
var mongoose      = require('mongoose');

//======================================================================
//                  connecting mongo database
//======================================================================
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/lawfirmUserAdmin');


// using Json response
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
multer();

app.use(session({

    secret: 'this is the secret',
    resave: true,
    saveUninitialized: true
}));

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));

require("./app/app.js")(app);

//======================================================================
//              connecting to port localhost:3000
//======================================================================
app.listen(3000);