'use strict';

var assert = require('assert');
var router = require('express').Router();
var tentacles = require('../tentacles');
var users = require('../db/users');
var updateUserGraph = require('../graph/update-user-graph');
var github = require('../utils/github');
var StatusError = require('statuserror');

router.get('/login', function(req, res, next) {
  res.redirect('https://github.com/login/oauth/authorize?client_id='+process.env.GITHUB_CLIENT_ID);
});

router.get('/callback', function(req, res, next) {
  assert(req.query.code, "code required");
  var accessToken;

  github.getAccessToken(req.query.code)
    .then(function(data) {
      if (data.access_token) {
        accessToken = data.access_token;
        return tentacles.user.getAuthUser({ accessToken: accessToken });
      } else {
        var redirect = new StatusError(301, 'access_token required')
        redirect.location = '/'
        throw redirect;
      }
    })
    .then(function(attrs) {
      return users.create(attrs);
    })
    .then(function(user) {
      // return a response immediately
      var payload = { login: user.login };
      res.cookie('auth', payload, {signed: true});
      res.redirect(process.env.FRONTEND_BASE_URL+'#login');

      if (user.partial == false) {
        // already loaded
        return;

      } else if (user.partial == true) {
        // still busy
        return;

      } else {
        // first time!
        return users.update(user.login, { partial: true })
          .then(function() {
            return updateUserGraph(user.login, accessToken);
          })
          .then(function() {
            // all done!
            return users.update(user.login, { partial: false });
          })
      }
    })
    .catch(next);
});

module.exports = router;
