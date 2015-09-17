var http = require('http');
var express = require('express');
var cors = require('cors');
var app = express();

app.use(cors());

app.get('/leaderboards/country', function(req, res) {
  //simulate delay
  setTimeout(function() {
    res.json([{
      country: 'usa',
      image: 'http://placehold.it/50x50',
      count: 212,
    },]);
  }, 300);
});

http.createServer(app).listen(8080);
