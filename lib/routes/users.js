'use strict';

var router = require('express').Router();
var db = require('../db');
var _ = require('underscore');

router.get('/going', function(req, res, next) {
  db.users.findAll()
    .then(function(users) {
      return res.send(_.map(users, function(user) {
        return _.pick(user, db.users.PUBLIC_ATTRIBUTES);
      }));
    })
    .catch(next);
});

// NOTE: is /leaderboars/distance not the same thing?
router.get('/locations', function(req, res, next) {
  db.users.findLocatable()
    .then(function(users) {
      var mapped = _.map(users, function(user) {
        var obj = _.pick(user, db.users.PUBLIC_ATTRIBUTES);
        return obj;
      });
      return res.send(mapped);
    })
    .catch(next);
});

router.get('/geojson', function(req, res, next) {
  db.users.findLocatable()
    .then(function(users) {
      var mapped = _.map(users, function(user) {
        var obj = {
          type: 'Feature',
          properties: {
            'title': user.login,
            'marker-size': 'small',
            'marker-color': '#F4D9A6',
          },
          geometry: {
            coordinates: [user.lon, user.lat],
            type: 'Point'
          }
        };
        return obj;
      });
      var geoJSON = {
        type: 'FeatureCollection',
        features: mapped
      };
      return res.send(geoJSON);
    })
    .catch(next);
});

module.exports = router;
