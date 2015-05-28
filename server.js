// server.js ======================================================

var express      = require('express');
var app          = express();
var port         = process.env.PORT || 8080;
var mongoose     = require('mongoose');
var passport     = require('passport');
var flash        = require('connect-flash');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var path         = require('path');
var multer       = require('multer');

// FILE UPLOADING=============================================================
var done = false;
var mMulter = multer({ dest: '././views/images/',
    rename: function (fieldname, filename) {
        return filename + Date.now();
    },
    onFileUploadStart: function (file) {
        console.log(file.originalname + ' is starting ...')
    },
    onFileUploadComplete: function (file) {
        console.log(file.fieldname + ' uploaded to  ' + file.path)
        done = true;
    }
});

app.post('/submitPhoto', mMulter, function(req){
    if(done == true){
        console.log(req.files);
    }
});



// DB CODE ===========================================================
var configDB = require('./config/database.js'); // Mongoose database
mongoose.connect(configDB.url); // Mongoose database
mongoose.connection.on('error', console.error);

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'app')));
app.use(express.static(path.join(__dirname, 'views')));

// passports =================================================================
require('./config/passport')(passport); // pass passport for configuration
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes

// launch ======================================================================
app.listen(port, function(){
    console.log('The magic happens on port ' + port);
});