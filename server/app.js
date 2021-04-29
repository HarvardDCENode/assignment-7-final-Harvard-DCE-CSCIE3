// app.js
require('dotenv').config();
var express = require('express');
var path = require('path');
var photos = require('./routes/photos');
var apiphotos = require('./routes/api/api-photos');
var bodyparser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@cluster0.njksd.mongodb.net/cscie31?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true})  
.catch((err)=>{
    console.error(`database connection error: ${err}`);
    process.exit();
  });

// initialize express
var app = express();

// set up date formatting package for access by templates
app.locals.moment = require('moment');

// set up 'utility' middleware
app.use(cookieParser('cscie31-secret'));
app.use(session({
  secret:"cscie31",
  resave: "true",
  saveUninitialized: "true"
}));
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// set up routes and routers
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/photos', photos);
app.use('/api/photos', apiphotos);

// we want the root route 
app.use('/', (req, res) => {
  var pattern = new RegExp('(.css|.html|.js|.ico|.jpg|.png)+\/?$', 'gi');
  if (pattern.test(req.url)) {
    let url = req.url.replace(/\/$/, "");
    res.sendFile(path.resolve(__dirname, `../client/dist/a131-angular-data-service-forms-http/${url}`));
  } else {
    res.sendFile(path.resolve(__dirname, '../client/dist/a131-angular-data-service-forms-http/index.html'));
  }
});

// catch any remaining routing errors
app.use((req, res, next)=>{
  var err = new Error('Not Found' + req.url);
  err.status = 404;
  next(err);
});
module.exports = app;
