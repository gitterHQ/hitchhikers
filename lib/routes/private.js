'use strict';

var assert = require('assert');
var router = require('express').Router();
var csv = require('fast-csv');
var queueUserGraphUpdate = require('../graph/queue-update');
var cache = require('apicache').options({ debug: true }).middleware;
var concat = require('concat-stream');

[
  'following-users',
  'starred-repos',
  'watching-repos',
  'user-forks',
  'user-issues',
  'user-issue-comments',
  'user-repos',
  'user-pull-requests'
].forEach(function(streamName) {
  var stream = require('../social-streams/' + streamName);

  router.get('/' + streamName, cache('5 minutes'), function(req, res, next) {
    res.set('Content-Type', 'text/csv');

    var readStream = stream(req.query.login, req.query.access_token)
      .pipe(csv.createWriteStream({ headers: true }));

    // Unforunately we need to concatenate the output if
    // we wish to use it with apicache
    readStream.pipe(concat(function(buffer) {
      res.send(buffer);
    }));

    readStream.on('error', function(err) {
      next(err);
    });
  });

});

router.get('/logmein', function(req, res) {
  var payload = { login: 'lerouxb' };
  res.cookie('auth', payload, {signed: true});
  res.send('ok');
});

router.get('/test/update', function(req, res, next) {
  assert(req.query.login, "login required");
  return queueUserGraphUpdate(req.query.login, req.query.access_token)
    .then(function() {
      res.sendStatus(200);
    })
    .catch(next);
});

/*
router.get('/test/add', function(req, res, next) {
  assert(req.query.login, "login required");

  tentacles.user.get(req.query.login, { accessToken: req.query.access_token })
    .then(function(attrs) {
      return db.users.create(attrs);
    })
    .then(function(user) {
      return queueUserGraphUpdate(req.query.login, req.query.access_token);
    })
    .then(function() {
      res.sendStatus(200);
    })
    .catch(next);
});
*/

module.exports = router;
