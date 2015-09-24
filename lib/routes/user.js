'use strict';

var router = require('express').Router();
var bodyParser = require('body-parser');
var db = require('../db');
var _ = require('underscore');

router.get('/', function(req, res, next) {
  res.send(req.user);
});

router.put('/', bodyParser.json(), bodyParser.urlencoded({ extended: true }),
function(req, res, next) {
  var attrs = _.clone(req.body);

  // don't allow changing these for now
  delete attrs.login;
  delete attrs.name;

  // other things I can think of:
  // * if lat or lon is set, then both must be set
  // * validate email?
  // * allow unsetting email, lat and lon by checking for blank string

  db.users.update(req.user.login, attrs)
    .then(function(user) {
      req.user = user; // in case things down the chain want it?
      res.send(req.user);
    })
    .catch(next);
});

router.delete('/', function(req, res, next) {
  // check cookie. if there's no cookie, 401. else delete from db
  db.users.destroy(req.user.login)
    .then(function() {
      res.clearCookie('auth');
      res.sendStatus(200);
    })
    .catch(next);
});
router.get('/suggestions', function(req, res, next) {
  db.users.getSuggestions(req.user.login)
    .then(function(suggestions) {
      var status = (req.user.partial) ? 206 : 200;
      res.status(status).send(suggestions);
    })
    .catch(next);
});

module.exports = router;
