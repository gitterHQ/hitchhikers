'use strict';

var router = require('express').Router();
var users = require('../db/users');
var _ = require('underscore');

var PUBLIC_FIELDS = ['login', 'name', 'lat', 'lon', 'city', 'country'];


router.get('/going', function(req, res, next) {
  users.findAll()
    .then(function(users) {
      return res.send(_.map(users, function(user) {
        return _.pick(user, PUBLIC_FIELDS);
      }));
    })
    .catch(next);
});

router.get('/locations', function(req, res, next) {
  users.findLocatable()
    .then(function(users) {
      return res.send(_.map(users, function(user) {
        return _.pick(user, PUBLIC_FIELDS);
      }));
    })
    .catch(next);
});

module.exports = router;
