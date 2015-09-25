'use strict';

var neo4jClient = require('./neo4jclient')

function collate(suggestions) {
  return suggestions.reduce(function(memo, suggestion) {
    var login = suggestion.login;
    var repo = suggestion.repo;

    if (!memo[login]) {
      memo[login] = {};
    }

    if (!memo[login][repo]) {
      memo[login][repo] = suggestion;
    }

    return memo;
  }, {});
}

function describeRelOther(rel) {
  switch(rel) {
    case 'OWNED': return 'owns';
    case 'FORKED': return 'forked';
    case 'ISSUE': return 'created issues on';
    case 'PULL_REQUEST': return 'created pull-requests on';
    case 'STARRED': return 'starred';
    case 'WATCH': return 'watched';
    case 'ISSUE_COMMENT': return 'commented on an issue on';
    case 'PUSHED': return 'committed to';
  }

  return rel;
}

function describeRelCurrent(rel) {
  switch(rel) {
    case 'OWNED': return 'you own';
    case 'FORKED': return 'you\'ve forked';
    case 'ISSUE': return 'you\'ve created issues for';
    case 'PULL_REQUEST': return 'you\'ve created pull-requests for';
    case 'STARRED': return 'you\'ve starred';
    case 'WATCH': return 'you watch';
    case 'ISSUE_COMMENT': return 'you\'ve commented on an issue on';
    case 'PUSHED': return 'you\'ve committed to';
  }
  return rel;
}

function flatten(collatedSuggestions) {
  var users = Object.keys(collatedSuggestions);
  return users.map(function(login) {
    var repos = Object.keys(collatedSuggestions[login]);

    var relationships = repos.map(function(repo) {
      var relationship = collatedSuggestions[login][repo];
      return describeRelOther(relationship.otherUserRel) + ' ' + repo + ' which ' + describeRelCurrent(relationship.currentUserRel);
    });

    return { login: login, relationship: relationships.slice(0,3).join(', ') };
  });
}
module.exports = function(login) {
  var query = 'MATCH (user:User)-[r1:FORKED|ISSUE|PULL_REQUEST|STARRED|WATCH|ISSUE_COMMENT]-(repo:Repo)-[r2:OWNED]-(u:User)' +
              ' WHERE user.login = {login} AND u.login <> {login}' +
              ' RETURN u.login,repo.fullName,type(r1) as r1type,type(r2) as r2type,1 as o LIMIT 100' +
              ' UNION' +
              ' MATCH (user:User)-[r1:OWNED|PUSHED]-(repo:Repo)-[r2:FORKED|ISSUE|PULL_REQUEST|ISSUE_COMMENT]-(u:User)' +
              ' WHERE user.login = {login} AND u.login <> {login}' +
              ' RETURN u.login,repo.fullName,type(r1) as r1type,type(r2) as r2type,2 as o LIMIT 100' +
              ' UNION' +
              ' MATCH (user:User)-[r1:FORKED|ISSUE|PULL_REQUEST|ISSUE_COMMENT|PUSHED]-(repo:Repo)-[r2:FORKED|ISSUE|PULL_REQUEST|ISSUE_COMMENT|PUSHED]-(u:User)' +
              ' WHERE user.login = {login} AND u.login <> {login}' +
              ' RETURN u.login,repo.fullName,type(r1) as r1type,type(r2) as r2type,3 as o LIMIT 100';

  return neo4jClient.query(query, { login: login })
    .then(function(results) {
      var suggestions = results.data.map(function(item) {
        return {
          login: item[0],
          repo: item[1],
          currentUserRel: item[2],
          otherUserRel: item[3],
          order: item[4]
        }
      });

      var collatedSuggestions = collate(suggestions);
      var flattened = flatten(collatedSuggestions)
      console.log(flattened);
    });
}

module.exports(process.argv[2]);
