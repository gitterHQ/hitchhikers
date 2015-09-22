'use strict';

var cypher = require("cypher-promise");
var neo4jClient = require('../db/neo4jClient');
var baseUrl = process.env.EXTERNAL_BASE_URL;
var url = require('url');


module.exports = function(login, accessToken) {

  function makeUrl(pathName) {
    var partial = url.format({ pathname: pathName, query: { login: login, access_token: accessToken } });
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

  return (function next() {
    var op = operations.shift();
    if (!op) return;
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
};
