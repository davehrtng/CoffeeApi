var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan'); // request logging
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');

// var passport = require('passport') - common for authentication

var routes = require('./routes/index');
var usersApi = require('./routes/api-users');
var ordersApi = require('./routes/api-orders');
var paymentsApi = require('./routes/api-payments');
var baristaView = require('./routes/barista');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
    allowedOrigins:[]
}));

app.use('/', routes);
app.use('/api/users', usersApi);
app.use('/api/orders', ordersApi);
app.use('/api/payments', paymentsApi);
app.use('/barista', baristaView);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// mongoose configuration
mongoose.connect('mongodb://localhost/Coffee');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback){
    console.log('Mongoose connected to orders!');

});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
