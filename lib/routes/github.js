'use strict';

var assert = require('assert');
var router = require('express').Router();
var tentacles = require('../tentacles');
var users = require('../db/users');
var updateUserGraph = require('../graph/update-user-graph');
var github = require('../utils/github')

router.get('/callback', function(req, res, next) {
  assert(req.query.code, "code required");
  var accessToken;

  github.getAccessToken(req.query.code)
    .then(function(data) {
      assert(data.access_token, "access_token required from github");
      accessToken = data.access_token;
      return tentacles.user.getAuthUser({ accessToken: accessToken })
    })
    .then(function(attrs) {
      return users.create(attrs);
    })
    .then(function(user) {
      // should we return and continue doing it in the background or do it
      // first, then only return so that we can immediately show the graph
      // info?
      return updateUserGraph(user.login, accessToken)
        .then(function() {
          return user;
        })
    })
    .then(function(user) {
      res.redirect(process.env.FRONTEND_BASE_URL+'/loggedin');
    })
    .catch(next);
});

module.exports = router;
