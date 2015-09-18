var http        = require('http');
var querystring = require('querystring');
var express     = require('express');
var cors        = require('cors');
var bodyParser  = require('body-parser');
var request     = require('superagent');
var app         = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/leaderboards/country', function(req, res) {
  //simulate delay
  setTimeout(function() {
    res.json([{
      country: 'usa',
      image: 'http://placehold.it/50x50',
      count: 212,
    },{
      country: 'great britan',
      image: 'http://placehold.it/50x50',
      count: 198,
    }, {
      country: 'canada',
      image: 'http://placehold.it/50x50',
      count: 76,
    }, {
      country: 'japan',
      image: 'http://placehold.it/50x50',
      count: 31,
    },{
      country: 'spain',
      image: 'http://placehold.it/50x50',
      count: 15,
    },]);
  }, 300);
});

app.get('/leaderboards/users', function(req, res) {
  //simulate delay
  setTimeout(function() {
    res.json([{
      username: 'little john',
      image: 'http://placehold.it/50x50',
      count: 102,
    },{
      username: 'jimblack',
      image: 'http://placehold.it/50x50',
      count: 86,
    }, {
      username: 'coltrain',
      image: 'http://placehold.it/50x50',
      count: 69,
    },{
      username: 'milesdavis',
      image: 'http://placehold.it/50x50',
      count: 61,
    },{
      username: 'chetbaker',
      image: 'http://placehold.it/50x50',
      count: 54,
    },]);
  }, 350);
});

app.get('/leaderboards/distance', function(req, res) {
  //simulate delay
  setTimeout(function() {
    res.json([{
      username: 'malditogeek',
      image: 'http://placehold.it/50x50',
      count: 12432,
    },{
      username: 'trevorah',
      image: 'http://placehold.it/50x50',
      count: 11932,
    },{
      username: 'andrew',
      image: 'http://placehold.it/50x50',
      count: 10234,
    }, {
      username: 'ricardobeta',
      image: 'http://placehold.it/50x50',
      count: 9876,
    }, {
      username: 'mydigitalself',
      image: 'http://placehold.it/50x50',
      count: 7534,
    },]);
  }, 250);
});

app.get('/client/key', function(req, res) {
  res.send(process.env.UNIVERSE_CLIENT_SECRET);
});

app.post('/client/token', function(req, res) {
  var query = querystring.stringify({
    client_id: require('../config/api.js').clientId,
    client_secret: process.env.UNIVERSE_CLIENT_SECRET,
    code: req.body.code,
  });
  var url = 'https://github.com/login/oauth/access_token?' + query;

  //get an access token
  request.get(url).end(function(err, githubRes) {
    if (err) return res.send(err.code, err.message);
    var userUrl = 'https://api.github.com/user?access_token=' + githubRes.body.access_token;

    //get the user object
    request.get(userUrl).end(function(err, userRes) {
      if (err) res.send(err.code, err.message);
      res.json({
        access_token: githubRes.body.access_token,
        user: userRes.body
      });
    });
  });
});

http.createServer(app).listen(8080);
