'use strict';

var assert = require('assert');
var router = require('express').Router();
var cookieParser = require('cookie-parser')
var csv = require('fast-csv');
var updateUserGraph = require('../graph/update-user-graph');

var tentacles = require('../tentacles');
var users = require('../db/users');

[
  'following-users',
  'starred-repos',
  'watching-repos'
].forEach(function(streamName) {
  var stream = require('../social-streams/' + streamName);

  router.get('/' + streamName, function(req, res, next) {
    assert(req.query.login, "login required");

    res.set('Content-Type', 'text/csv');

    stream(req.query.login, req.query.access_token)
      .pipe(csv.createWriteStream({ headers: true }))
      .pipe(res)
      .on('error', function(err) {
        next(err);
      });
  });

});

router.get('/logmein', function(req, res, next) {
  var payload = { login: 'lerouxb' };
  res.cookie('auth', payload, {signed: true});
  res.send('ok');
});

router.get('/test/update', function(req, res, next) {
  assert(req.query.login, "login required");
  updateUserGraph(req.query.login, req.query.access_token)
    .then(function() {
      res.sendStatus(200);
    })
    .catch(next);
});

router.get('/test/add', function(req, res, next) {
  assert(req.query.login, "login required");

  tentacles.user.get(req.query.login, { accessToken: req.query.access_token })
    .then(function(attrs) {
      return users.create(attrs)
    })
    .then(function(user) {
      return updateUserGraph(req.query.login, req.query.access_token)
    })
    .then(function() {
      res.sendStatus(200);
    })
    .catch(next);
});

module.exports = router;
