'use strict';

var assert = require('assert');
var _ = require('underscore');
var Promise = require('bluebird');
var neo4jClient = require('./neo4jclient')
var cypher = require('../utils/cypher');

var exports = module.exports = {};

var USER_ATTRIBUTES = ['name', 'login', 'email',
                       'lat', 'lon', 'city', 'country',
                       'partial'];

exports.create = function(attrs) {
  assert(attrs.name, "name required");
  assert(attrs.login, "login required");

  attrs = _.pick(attrs, USER_ATTRIBUTES);

  var attrPairs = cypher.formatAttrs(attrs);
  var query = 'MERGE (user:User { login: {login} }) '+
              'ON CREATE SET user = { '+attrPairs+' } '+
              'ON MATCH SET user += { '+attrPairs+' }'+
              'RETURN user';
  return neo4jClient.query(query, attrs)
    .then(function(response) {
      var data = cypher.getResponseData(response, true);
      var user = data[0];
      return user;
    });
};

exports.get = function(login) {
  var query = 'MATCH (user:User { login: {login} }) '+
              'RETURN user';
  return neo4jClient.query(query, {login: login})
    .then(function(response) {
      return cypher.getResponseOrNull(response);
    });
};

exports.update = function(login, attrs) {
  // TODO: are you allowed to even update the login?

  attrs = _.pick(attrs, USER_ATTRIBUTES);

  var attrPairs = cypher.formatAttrs(attrs);
  // Also add the login again for the match, after we joined them for
  // setting so we don't accidentally add another key and don't reuse the same
  // key name otherwise we can't rename the login. Not that we ever will,
  // but still.
  attrs.loginMatch = login;
  var query = 'MATCH (user:User { login: {loginMatch} }) '+
              'SET user += { '+attrPairs+' } '+
              'RETURN user';
  return neo4jClient.query(query, attrs)
    .then(function(response) {
      return cypher.getResponseOrNull(response);
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
      return cypher.getResponseOrNull(response);
    });
};

exports.getSuggestions = function(login) {
  /*
  TODO: you can also get shortestPath() or allShortestPaths(). Maybe also sort
  by the number of shortest paths matching the shortest path's length?  Then
  when you follow someone AND they follow you will appear before someone that
  just follows some one else (or someone being followed) but that has more
  paths of length 2. If that makes sense..
  Or get the directional paths from you to the other user and the paths back
  separately and then sort on those.
  Assuming you even care about people that also follow you back or did work on
  repos you care about.
  */

  // TODO: go with slightly more interesting score so that enough two-level
  // things can outweigh "this spammy guy follows you"

  // excuse the weird AND and , placement. It is to comment out the lines
  // individually
  var q = ['MATCH path=(u:User)-[*1..2]-(s:User)',
           '    , shortestPath = shortestPath((u:User)-[*1..2]-(s:User))',
           'WHERE u.login = {login}',
           '  AND has(s.name)',
           '  AND s.login <> u.login',
           'RETURN s.login as login',
           '     , shortestPath',
           '     , min(length(path)) AS shortest',
           '     , count(*) AS total',
           'ORDER BY shortest, total DESC',
           'LIMIT 10'].join('\n');
  //console.log(q);
  return neo4jClient.query(q, {login: login})
    .then(function(response) {
      var users = cypher.getResponseData(response, false);

      // gather all the ids
      var rids = [];
      var nids = [];
      _.each(users, function(user) {
        _.each(user.shortestPath.relationships, function(r) {
          rids.push(cypher.extractIdFromURL(r));
        });
        _.each(user.shortestPath.nodes, function(n) {
          nids.push(cypher.extractIdFromURL(n));
        });
      });
      return Promise.props({
        relationships: getRelationshipsById(rids),
        nodes: getNodesById(nids) // users and repos
      }).then(function(cache) {
        return _.map(users, function(user) {
          return {
            login: user.login,
            reason: getReasonForUser(user, user.shortestPath, cache)
          }
        });
      });
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
      return users;
    });
};

exports.findLocatable = function() {
  var q = ['MATCH (user:User)',
           'WHERE has(user.name)',
           '  AND has(user.lat)',
           '  AND has(user.lon)',
           '  AND has(user.city)',
           '  AND has(user.country)',
           'RETURN user',
           'ORDER BY user.name'].join('\n');

  return neo4jClient.query(q)
    .then(function(response) {
      var users = cypher.getResponseData(response, true);
      return users;
    });
};

///

var getRelationshipsById = exports.getRelationshipsById = function(ids) {
  var q = ['MATCH ()-[r]->()',
           'WHERE id(r) in ['+ids+']',
           'RETURN id(r) as rid, type(r) as type'].join('\n');
  return neo4jClient.query(q)
    .then(function(response) {
      var data = cypher.getResponseData(response, false);
      return _.reduce(data, function(memo, item) {
        memo[item.rid] = item.type;
        return memo;
      }, {});
    });
};

var getNodesById = exports.getNodesById = function(ids) {
  var q = ['MATCH n ',
           'WHERE id(n) in ['+ids+']',
           'RETURN id(n) as id, n'].join('\n');
  return neo4jClient.query(q)
    .then(function(response) {
      var data = cypher.getResponseData(response, false);
      return _.reduce(data, function(memo, item) {
        memo[item.id] = item.n.data;
        return memo;
      }, {});
    });
}

var RELATIONSHIPS = {
  'FOLLOW': {
    '->': 'follow',     // you follow USER
    '<-': 'followed by' // you are followed by USER
                        // USER1 who is followed by USER2
  },
  'STARRED': {
    '->': 'starred',    // you starred REPO
    '<-': 'starred by'  // REPO is starred by USER
  },
  'WATCH': {
    '->': 'watch',      // you watch REPO
    '<-': 'watched by'  // REPO is watched by USER
  }
};

var getNodeTerm = exports.getNodeTerm = function(node) {
  // node is either a room or a user in our case
  // TODO: actually make a link
  return node.login || node.fullName;
};

var getRelType = exports.getRelType = function(url, cache) {
  var id = cypher.extractIdFromURL(url);
  return cache.relationships[id];
};

var getRelName = exports.getRelName = function(type, direction) {
  return RELATIONSHIPS[type][direction];
};

var getNodeFromCache = exports.getNodeFromCache = function(url, cache) {
  var id = cypher.extractIdFromURL(url);
  return cache.nodes[id];
};

var getReasonForUser = exports.getReasonForUser = function(user, path, cache) {
  // TODO: english description
  // * take the first one from login to target if one exists
  // * take the first one from target to login if one exists
  // * if two:
  //   - if the same relationship: both X whatever
  //   - if different: "login X target and target Y login"
  // * if just one, then "login X target" or "target X login", whichever
  //[ 'relationships', 'nodes', 'directions', 'start', 'length', 'end' ]
  // basically there can only be one or two relationships because there can
  // only be two or three nodes.

  // NOTE: we're kinda assuming that you're always the first node here. Which
  // it should be according to how the query was written..
  assert(user.login, path.nodes[0].login, "first user must match");

  var parts = [];

  var t1 = getRelType(path.relationships[0], cache);
  var d1 = path.directions[0];
  var r1 = getRelName(t1, d1);
  var n1 = getNodeFromCache(path.nodes[1], cache);

  parts.push('You');

  if (path.relationships.length == 1) {
    if (r1 == 'followed by') {
      parts.push('are');
    }
    parts.push(r1);
    parts.push(getNodeTerm(n1)); // user

  } else {
    var t2 = getRelType(path.relationships[1], cache);
    var d2 = path.directions[1];
    var r2 = getRelName(t2, d2);
    var n2 = getNodeFromCache(path.nodes[2], cache);

    if (d1 == '->' && d2 == '<-' && t1 == t2) {
      parts.push('both')
      parts.push(r1);
      parts.push(getNodeTerm(n1)); // repo or user

    } else {

      if (r1 == 'followed by') {
        parts.push('are');
      }
      parts.push(r1);
      parts.push(getNodeTerm(n1)); // user

      if (n1.login) {
        parts.push('who is');
      } else {
        parts.push('which is');
      }

      if (t1 == t2) {
        parts.push('also')
      }

      parts.push(r2);

      parts.push(getNodeTerm(n2)); // will be a user
    }
  }

  return parts.join(' ')+'.';
}
