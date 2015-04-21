'use strict';

require('newrelic');

var express = require('express');
var path = require('path');

var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended:false
}));

//connect to database
mongoose.connect('mongodb://localhost/eurasiaLetusgo', function (err) {
    if (err) {
        console.log('connection error', err);
    } else {
        console.log('connection successful');
    }
});

function appInit(port) {
  app.set('port',port);
  // changes it to use the optimized version for production
  //app.use(express.static(path.join(__dirname, '/dist')));
  app.use(express.static(path.join(__dirname, './public')));
  app.use(express.static(path.join(__dirname, './.tmp')));
  app.use(express.static(path.join(__dirname, './')));
  app.use(express.static(path.join(__dirname, './jspm_packages')));
  // production error handler
  // no stacktraces leaked to user
}

if (app.get('env') === 'production') {
  appInit(80);
}
appInit(3000);

// routes
var router = require('./router');
router(app);

app.get('*', function(req, res, next){

  var err =  new Error('bad request');
  err.status = 404;
  next(err);

});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);

  if(req.accepts()){
    console.log('hello');

    res.send({
      status: err.status || 500,
      massage: err.message
    });
  }

  res.render('error', {
      message: err.message,
      error: err
    });
  next();
});

module.exports = app;




