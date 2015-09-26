'use strict';

var assert = require('assert');
var _ = require('underscore');
var geolib = require('geolib');
var neo4jClient = require('./neo4jclient');
var cypher = require('../utils/cypher');
var validation = require('../utils/validation');

var USER_ATTRIBUTES = exports.USER_ATTRIBUTES = [
  'name', 'login', 'email', 'lat', 'lon', 'city', 'country', 'code', 'partial', 'followers'
];

var LOCATION_ATTRIBUTES = exports.LOCATION_ATTRIBUTES = [
  'lat', 'lon', 'city', 'country', 'code'
];

var prefill = exports.prefill = function(user) {
  // for calculated fields
  if (user.lat && user.lon) {
    var f = {
      latitude: user.lat,
      longitude: user.lon
    };
    var t = {
      latitude: parseFloat(process.env.VENUE_LAT),
      longitude: parseFloat(process.env.VENUE_LON)
    };
    user.distance = geolib.getDistance(f, t);
  }
};

var getPrefilledUserFromResponse = function(response) {
  var user = cypher.getResponseOrNull(response);
  if (user) {
    prefill(user);
  }
  return user;
};

exports.create = function(attrs) {
  assert(attrs.login, "login required");
  if (!attrs.name) {
    attrs.name = attrs.login;
  }

  attrs = _.pick(attrs, USER_ATTRIBUTES);

  var attrPairs = cypher.formatAttrs(attrs);
  var query = 'MERGE (user:User { login: {login} }) '+
              'ON CREATE SET user = { '+attrPairs+' } '+
              'ON MATCH SET user += { '+attrPairs+' }'+
              'RETURN user';
  console.log(attrs);
  return neo4jClient.query(query, attrs)
    .then(function(response) {
      return getPrefilledUserFromResponse(response);
    });
};

exports.get = function(login) {
  var query = 'MATCH (user:User { login: {login} }) '+
              'RETURN user';
  return neo4jClient.query(query, {login: login})
    .then(function(response) {
      return getPrefilledUserFromResponse(response);
    });
};

exports.update = function(login, attrs) {
  // TODO: are you allowed to even update the login?

  attrs = _.pick(attrs, USER_ATTRIBUTES);
  attrs = validation.allOrNothing(attrs, LOCATION_ATTRIBUTES);

  var keys = _.keys(attrs);

  // blank ones mean delete
  var blankKeys = _.filter(keys, validation.attrBlank(attrs));
  attrs = _.omit(attrs, blankKeys);

  // only set if we're actually setting things
  var attrPairs = cypher.formatAttrs(attrs);
  var setClause = '';
  if (!_.isEmpty(attrs)) {
    setClause = 'SET user += { '+attrPairs+' }';
  }

  // only remove if we're actually removing things
  var removeClause = '';
  var blankNames = _.map(blankKeys, function(key) {
    return 'user.'+key;
  });
  if (blankKeys.length) {
    removeClause = 'REMOVE '+blankNames.join(', ');
  }

  // Also add the login again for the match, after we joined them for
  // setting so we don't accidentally add another key and don't reuse the same
  // key name otherwise we can't rename the login. Not that we ever will,
  // but still.
  attrs.loginMatch = login;
  var query = ['MATCH (user:User { login: {loginMatch} })',
              setClause,
              removeClause,
              'RETURN user'].join('\n');
  return neo4jClient.query(query, attrs)
    .then(function(response) {
      return getPrefilledUserFromResponse(response);
    });
};

exports.destroy = function(login) {
  // Clear all the extra fields other than login. Don't actually delete that
  // because someone could be following this user and if we delete the login
  // too, then we're actually deleting some of that user's data. That would
  // cause some nasty bugs if poeple delete themselves and then come back
  // again.

  var query = 'MATCH (user:User { login: {login} }) '+
              'SET user = { login: {login} }'+
              'RETURN user';
  // not sure what to return in this case
  return neo4jClient.query(query, {login: login})
    .then(function(response) {
      return getPrefilledUserFromResponse(response);
    });
};

exports.findAll = function() {
  var q = ['MATCH (user:User)',
           'WHERE has(user.name)',
           'RETURN user',
           'ORDER BY user.name'].join('\n');

  return neo4jClient.query(q)
    .then(function(response) {
      var users = cypher.getResponseData(response, true);
      _.map(users, function(user) {
        prefill(user);
      });
      return users;
    });
};

exports.findEmailable = function() {
  var q = ['MATCH (user:User)',
           'WHERE has(user.name)',
           '  AND has(user.email)',
           'RETURN user',
           'ORDER BY user.name'].join('\n');

  return neo4jClient.query(q)
    .then(function(response) {
      var users = cypher.getResponseData(response, true);
      _.map(users, function(user) {
        prefill(user);
      });
      return users;
    });
};

exports.findLocatable = function() {
  var q = ['MATCH (user:User)',
           'WHERE has(user.name)',
           '  AND has(user.lat) AND user.lat <> ""',
           '  AND has(user.lon) AND user.lon <> ""',
           '  AND has(user.city) AND user.city <> ""',
           '  AND has(user.country) AND user.country <> ""',
           '  AND has(user.code) AND user.code <> ""',
           'RETURN user',
           'ORDER BY user.name'].join('\n');

  return neo4jClient.query(q)
    .then(function(response) {
      var users = cypher.getResponseData(response, true);
      _.map(users, function(user) {
        prefill(user);
      });
      return users;
    });
};
