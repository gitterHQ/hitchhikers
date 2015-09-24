'use strict';

var router = require('express').Router();
var db = require('../db');
var _ = require('underscore');

function countsByKeys(objects, keys, sign) {
  var sign = sign || 1;
  var groupedCounts = _.countBy(objects, function(obj) {
    var parts = [];
    _.each(keys, function(key) {
      parts.push(obj[key]);
    });
    return parts.join('__');
  });
  var pairs = _.pairs(groupedCounts);
  var sorted = _.sortBy(pairs, function(pair) {
    return sign*pair[1];
  });
  var results = _.map(sorted, function(pair) {
    var obj = {};
    var parts = pair[0].split('__');
    _.each(keys, function(key, index) {
      obj[key] = parts[index];
    });
    obj.count = pair[1];
    return obj;
  });
  return results;
}

router.get('/country', function(req, res, next) {
  return db.users.findLocatable()
    .then(function(users) {
      var results = countsByKeys(users, ['code', 'country'], -1);
      res.send(results);
    })
    .catch(next);
});

router.get('/city', function(req, res, next) {
  // Two Londons would totally screw this up as it doesn't do country+city
  // combo.
  return db.users.findLocatable()
    .then(function(users) {
      var results = countsByKeys(users, ['city', 'code', 'country'], -1);
      res.send(results);
    })
    .catch(next);
});

// NOTE: is /users/locations not the same thing?
router.get('/distance', function(req, res, next) {
  return db.users.findLocatable()
    .then(function(users) {
      var results = _.sortBy(users, function(user) {
        return -user.distance;
      });
      var filtered = _.map(results, function(user) {
        return _.pick(user, db.users.PUBLIC_ATTRIBUTES);
      });
      res.send(filtered);
    })
    .catch(next);
});

module.exports = router;
