'use strict';

var express = require('express');
var cookieParser = require('cookie-parser')
var authuser = require('./lib/middleware/authuser');

var app = express();

app.use(cookieParser(process.env.COOKIE_SECRET));

app.use('/github', require('./lib/routes/github'));
app.use('/user', authuser, require('./lib/routes/user'));
app.use('/private', require('./lib/routes/private'));

var server = app.listen(process.env.PORT || 3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Listening at http://%s:%s', host, port);
});

