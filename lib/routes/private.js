'use strict';

var assert = require('assert');
var router = require('express').Router();
var cookieParser = require('cookie-parser')
var csv = require('fast-csv');
var updateUserGraph = require('../graph/update-user-graph');

var Tentacles = require('tentacles');
var users = require('../db/users');

[
  'following-users',
  'starred-repos',
  'watching-repos'
].forEach(function(streamName) {
  var stream = require('../social-streams/' + streamName);

  router.get('/' + streamName, function(req, res, next) {
    assert(req.query.login, "login required");
    assert(req.query.access_token, "access_token required");

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
  var payload = {
    login: 'lerouxb'//,
    //accessToken: process.env.GITHUB_ACCESS_TOKEN
  };
  res.cookie('auth', payload, {signed: true});
  res.send('ok');
});

router.get('/test/update', function(req, res, next) {
  assert(req.query.login, "login required");
  assert(req.query.access_token, "access_token required");
  updateUserGraph(req.query.login, req.query.access_token)
    .then(function() {
      res.sendStatus(200);
    })
    .catch(next);
});

router.get('/test/add', function(req, res, next) {
  assert(req.query.login, "login required");
  assert(req.query.access_token, "access_token required");


  var tentacles = new Tentacles({ accessToken: req.query.access_token });
  tentacles.user.get(req.query.login)
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
