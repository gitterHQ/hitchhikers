'use strict';

var express = require('express');
var cookieParser = require('cookie-parser')
var authuser = require('./lib/middleware/authuser');
var cors = require('cors');

var app = express();

app.use('/build', express.static('build'));
app.use('/node_modules/octicons', express.static('node_modules/octicons'));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(cors());

app.use('/github', require('./lib/routes/github'));
app.use('/user', authuser, require('./lib/routes/user'));
app.use('/private', require('./lib/routes/private'));
app.use('/leaderboards', require('./mock/index'));

app.use(function(req, res, next) {
  console.log('%s %s %s', req.method, req.url, req.path);
  next();
});

app.get('/', function(req, res){
  res.sendFile('./index.html', {root: __dirname});
});

var server = app.listen(process.env.PORT || 3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Listening at http://%s:%s', host, port);
});

