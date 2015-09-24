'use strict';

var router = require('express').Router();
var users = require('../db/users');
var _ = require('underscore');

function countsByKey(objects, key, sign) {
  var sign = sign || 1;
  var groupedCounts = _.countBy(objects, key);
  var pairs = _.pairs(groupedCounts);
  var sorted = _.sortBy(pairs, function(pair) {
    return sign*pair[1];
  });
  var results = _.map(sorted, function(pair) {
    var obj = {};
    obj[key] = pair[0];
    obj.count = pair[1];
    return obj;
  });
  return results;
}

router.get('/country', function(req, res, next) {
  return users.findLocatable()
    .then(function(users) {
      var results = countsByKey(users, 'country', -1);
      res.send(results);
    })
    .catch(next);
});

router.get('/city', function(req, res, next) {
  // Two Londons would totally screw this up as it doesn't do country+city
  // combo.
  return users.findLocatable()
    .then(function(users) {
      var results = countsByKey(users, 'city', -1);
      res.send(results);
    })
    .catch(next);
});

// NOTE: is /users/locations not the same thing?
router.get('/distance', function(req, res, next) {
  return users.findLocatable()
    .then(function(users) {
      var results = _.sortBy(users, function(user) {
        return -user.distance;
      });
      var filtered = _.map(users, function(user) {
        return _.pick(user, users.PUBLIC_FIELDS);
      });
      res.send(filtered);
    })
    .catch(next);
});

module.exports = router;
