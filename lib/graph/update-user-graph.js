'use strict';

var cypher = require("cypher-promise");
var neo4jClient = require('../db/neo4jclient');
var baseUrl = process.env.EXTERNAL_BASE_URL;
var url = require('url');
var db = require('../db');

function loadData(login, accessToken) {

  function makeUrl(pathName) {
    var partial = url.format({
      pathname: pathName,
      query: {
        login: login,
        accessToken: accessToken,
        secret: process.env.PRIVATE_SECRET
      }
    });
    return url.resolve(baseUrl, partial);
  }

  var operations = [];

  operations.push(['CREATE INDEX ON :User(login)']);
  operations.push(['CREATE INDEX ON :Repo(fullName)']);

  // Following
  operations.push(['USING PERIODIC COMMIT LOAD CSV WITH HEADERS FROM "' + makeUrl('/private/following-users') + '" AS row ' +
    'MERGE (followee:User { login: row.login })']);

  operations.push(['USING PERIODIC COMMIT LOAD CSV WITH HEADERS FROM "' + makeUrl('/private/following-users') + '" AS row ' +
    'MATCH (follower:User { login: {login} }), (followee:User { login: row.login }) ' +
    'MERGE (follower)-[f:FOLLOW]->(followee)',
    { login: login }]);

  // Starred
  operations.push(['USING PERIODIC COMMIT LOAD CSV WITH HEADERS FROM "' + makeUrl('/private/starred-repos') + '" AS row ' +
    'MERGE (repo:Repo { fullName: row.full_name }) ' +
    'ON CREATE SET repo.language = row.language']);

  operations.push(['USING PERIODIC COMMIT LOAD CSV WITH HEADERS FROM "' + makeUrl('/private/starred-repos') + '" AS row ' +
    'MATCH (starrer:User { login: {login} }), (repo:Repo { fullName: row.full_name }) ' +
    'MERGE (starrer)-[f:STARRED]-(repo)',
    { login: login }]);

  // Watching
  operations.push(['USING PERIODIC COMMIT LOAD CSV WITH HEADERS FROM "' + makeUrl('/private/watching-repos') + '" AS row ' +
    'MERGE (repo:Repo { fullName: row.full_name }) ' +
    'ON CREATE SET repo.language = row.language']);

  operations.push(['USING PERIODIC COMMIT LOAD CSV WITH HEADERS FROM "' + makeUrl('/private/watching-repos') + '" AS row ' +
    'MATCH (watcher:User { login: {login} }), (repo:Repo { fullName: row.full_name }) ' +
    'MERGE (watcher)-[f:WATCH]-(repo)',
    { login: login }]);

  // Repos belonging to a user
  operations.push(['USING PERIODIC COMMIT LOAD CSV WITH HEADERS FROM "' + makeUrl('/private/user-repos') + '" AS row ' +
    'MERGE (repo:Repo { fullName: row.full_name }) ' +
    'ON CREATE SET repo.language = row.language']);

  operations.push(['USING PERIODIC COMMIT LOAD CSV WITH HEADERS FROM "' + makeUrl('/private/user-repos') + '" AS row ' +
    'MATCH (watcher:User { login: {login} }), (repo:Repo { fullName: row.full_name }) ' +
    'MERGE (watcher)-[f:OWNED]-(repo)',
    { login: login }]);

  // Things the user has forked
  operations.push(['USING PERIODIC COMMIT LOAD CSV WITH HEADERS FROM "' + makeUrl('/private/user-forks') + '" AS row ' +
    'MERGE (repo:Repo { fullName: row.full_name }) ' +
    'ON CREATE SET repo.language = row.language']);

  operations.push(['USING PERIODIC COMMIT LOAD CSV WITH HEADERS FROM "' + makeUrl('/private/user-forks') + '" AS row ' +
    'MATCH (watcher:User { login: {login} }), (repo:Repo { fullName: row.full_name }) ' +
    'MERGE (watcher)-[f:FORKED]-(repo)',
    { login: login }]);

  // Pull requests for the user
  operations.push(['USING PERIODIC COMMIT LOAD CSV WITH HEADERS FROM "' + makeUrl('/private/user-pull-requests') + '" AS row ' +
    'MERGE (repo:Repo { fullName: row.full_name }) ' +
    'ON CREATE SET repo.language = row.language']);

  operations.push(['USING PERIODIC COMMIT LOAD CSV WITH HEADERS FROM "' + makeUrl('/private/user-pull-requests') + '" AS row ' +
    'MATCH (watcher:User { login: {login} }), (repo:Repo { fullName: row.full_name }) ' +
    'MERGE (watcher)-[f:PULL_REQUEST]-(repo)',
    { login: login }]);

  // Issues for the user
  operations.push(['USING PERIODIC COMMIT LOAD CSV WITH HEADERS FROM "' + makeUrl('/private/user-issues') + '" AS row ' +
    'MERGE (repo:Repo { fullName: row.full_name }) ' +
    'ON CREATE SET repo.language = row.language']);

  operations.push(['USING PERIODIC COMMIT LOAD CSV WITH HEADERS FROM "' + makeUrl('/private/user-issues') + '" AS row ' +
    'MATCH (watcher:User { login: {login} }), (repo:Repo { fullName: row.full_name }) ' +
    'MERGE (watcher)-[f:ISSUE]-(repo)',
    { login: login }]);

  // Issue-comments for the user
  operations.push(['USING PERIODIC COMMIT LOAD CSV WITH HEADERS FROM "' + makeUrl('/private/user-issue-comments') + '" AS row ' +
    'MERGE (repo:Repo { fullName: row.full_name }) ' +
    'ON CREATE SET repo.language = row.language']);

  operations.push(['USING PERIODIC COMMIT LOAD CSV WITH HEADERS FROM "' + makeUrl('/private/user-issue-comments') + '" AS row ' +
    'MATCH (watcher:User { login: {login} }), (repo:Repo { fullName: row.full_name }) ' +
    'MERGE (watcher)-[f:ISSUE_COMMENT]-(repo)',
    { login: login }]);

  // Issue-comments for the user
  operations.push(['USING PERIODIC COMMIT LOAD CSV WITH HEADERS FROM "' + makeUrl('/private/user-pushes') + '" AS row ' +
    'MERGE (repo:Repo { fullName: row.full_name }) ' +
    'ON CREATE SET repo.language = row.language']);

  operations.push(['USING PERIODIC COMMIT LOAD CSV WITH HEADERS FROM "' + makeUrl('/private/user-pushes') + '" AS row ' +
    'MATCH (watcher:User { login: {login} }), (repo:Repo { fullName: row.full_name }) ' +
    'MERGE (watcher)-[f:PUSHED]-(repo)',
    { login: login }]);



  return (function next() {
    var op = operations.shift();
    if (!op) return;
    console.log(op);
    return neo4jClient.query(op[0], op[1])
      .catch(function(e) {
        // just ignore this one
        if (e.message == 'next on empty iterator') {
          next();
          return;
        }

        console.error(e);
        console.error(e.stack);
        throw new Error('Error executing ' + op + ', code=' + e.code, ', message=' + e.message + ', name=' + e.name);
      })
      .then(next);
  })();
}

module.exports = function(login, accessToken) {
  return db.users.update(login, { partial: true })
    .then(function() {
      return loadData(login, accessToken);
    })
    .then(function() {
      return db.users.update(login, { partial: false });
    });
}
