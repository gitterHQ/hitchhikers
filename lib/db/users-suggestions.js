'use strict';

var neo4jClient = require('./neo4jclient');
var speakers = require('./speakers');
var defaultSuggestions = require('./default-suggestions');
var MAX_SUGGESTIONS = 10;
var MAX_DEFAULT_SUGGESTIONS = 2;

/**
 * Suggestions based on following
 */
function getFollowerSuggestions(login) {
  var query = 'MATCH (u:User)-[r:FOLLOW]->(u2:User) WHERE u.login = {login} AND u2.followers is not null RETURN u2.login, u2.name, u2.followers as followers ORDER BY followers DESC';

  return neo4jClient.query(query, { login: login })
    .then(function(results) {
      return results.data.map(function(item) {
        var login = item[0];
        return {
          login: login,
          name: item[1],
          reason: 'You follow ' + item[0] + '.',
          speaker: !!(speakers.set[login])
        };
      });
    });
}

function collate(suggestions) {
  return suggestions.reduce(function(memo, suggestion) {
    var login = suggestion.login;
    var repo = suggestion.repo;

    if (!memo[login]) {
      memo[login] = {
        name: suggestion.name,
        repos: {}
      };
    }

    if (!memo[login].repos[repo]) {
      memo[login].repos[repo] = suggestion;
    }

    return memo;
  }, {});
}

function describeRelOther(rel) {
  switch(rel) {
    case 'OWNED': return 'Owns';
    case 'FORKED': return 'Forked';
    case 'ISSUE': return 'Created issues on';
    case 'PULL_REQUEST': return 'Created pull-requests on';
    case 'STARRED': return 'Starred';
    case 'WATCH': return 'Watched';
    case 'ISSUE_COMMENT': return 'Commented on an issue on';
    case 'PUSHED': return 'Committed to';
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
    var repoHash = collatedSuggestions[login].repos;
    var repos = Object.keys(repoHash);

    var relationships = repos.map(function(repo) {
      var relationship = repoHash[repo];
      return describeRelOther(relationship.otherUserRel) + ' ' + repo + ' which ' + describeRelCurrent(relationship.currentUserRel);
    });

    return {
      login: login,
      user: collatedSuggestions[login].name,
      reason: relationships.slice(0,2).join('. ') + '.',
      speaker: !!(speakers.set[login])
    };
  });
}

function getActivitySuggestions(login) {
  var query = 'MATCH (user:User)-[r1:FORKED|ISSUE|PULL_REQUEST|STARRED|WATCH|ISSUE_COMMENT]-(repo:Repo)-[r2:OWNED]-(u:User)' +
              ' WHERE user.login = {login} AND u.login <> {login}' +
              ' RETURN u.login,u.name,repo.fullName,type(r1) as r1type,type(r2) as r2type,1 as o LIMIT 100' +
              ' UNION' +
              ' MATCH (user:User)-[r1:OWNED|PUSHED]-(repo:Repo)-[r2:FORKED|ISSUE|PULL_REQUEST|ISSUE_COMMENT]-(u:User)' +
              ' WHERE user.login = {login} AND u.login <> {login}' +
              ' RETURN u.login,u.name,repo.fullName,type(r1) as r1type,type(r2) as r2type,2 as o LIMIT 100';

  return neo4jClient.query(query, { login: login })
    .then(function(results) {
      var suggestions = results.data.map(function(item) {
        return {
          login: item[0],
          name: item[1],
          repo: item[2],
          currentUserRel: item[3],
          otherUserRel: item[4],
          order: item[5]
        };
      });

      var collatedSuggestions = collate(suggestions);
      var flattened = flatten(collatedSuggestions);
      return flattened;
    });
}

function getUniqueItems(array, maxLength) {
  var hash = {};
  var items = [];
  for(var i = 0; i < array.length; i++) {
    var item = array[i];
    if (!hash[item]) {
      hash[item] = 1;
      items.push(item);
      if (items.length >= maxLength) break;
    }
  }
  return items;
}

function getCommonSuggestions(login) {
  var query = 'MATCH (u1:User)-[r1]-(r:Repo)-[r2]-(u2:User)' +
              ' WHERE u1.login = {login} AND u2.login <> {login} AND has(u2.name)' +
              ' RETURN u2.login as login, u2.name as name, collect(r.fullName) as repos, count(u2.login) AS total' +
              ' ORDER BY total DESC' +
              ' LIMIT 100';

  return neo4jClient.query(query, { login: login })
    .then(function(results) {
      return results.data.map(function(item) {

        return {
          login: item[0],
          name: item[1],
          reason: 'You share an interest in common repos, including ' + getUniqueItems(item[2], 2).join(' and ') + '.',
          speaker: !!(speakers.set[login])
        };
      });
    });

}

/**
 * Fisher-Yates (aka Knuth) Shuffle.
 */
function shuffle(array) {
  if (!array) return [];
  array = array.slice();
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

/**
 * Return a set of all the logins suggested
 */
function getSuggestedUsersSet(suggestions) {
  return suggestions.reduce(function(memo, suggestion) { memo[suggestion.login] = 1; return memo; }, {});
}

module.exports = function(login, options) {
  var maxSuggestions = options && options.maxSuggestions || MAX_SUGGESTIONS;
  return getFollowerSuggestions(login)
    .then(function(suggestions) {
      if (suggestions.length >= maxSuggestions) return suggestions.slice(0, maxSuggestions);

      // Add activity suggestions
      return getActivitySuggestions(login)
        .then(function(activitySuggestions) {
          // Filter out any users already suggested
          var users = getSuggestedUsersSet(suggestions);

          activitySuggestions = activitySuggestions.filter(function(suggestion) {
            return !users[suggestion.login]; // Not already suggested
          });

          suggestions = suggestions.concat(activitySuggestions);
          if (suggestions.length >= maxSuggestions) return suggestions.slice(0, maxSuggestions);

          return getCommonSuggestions(login)
            .then(function(commonSuggestions) {
              var users = getSuggestedUsersSet(suggestions);
              commonSuggestions = commonSuggestions.filter(function(suggestion) {
                return !users[suggestion.login]; // Not already suggested
              });

              suggestions = suggestions.concat(commonSuggestions);
              if (suggestions.length >= maxSuggestions) return suggestions.slice(0, maxSuggestions);

              users = getSuggestedUsersSet(suggestions);

              var extraSuggestions = shuffle(defaultSuggestions.list);
              var extraSuggestionsCount = 0;

              while(extraSuggestions.length && suggestions.length < maxSuggestions && extraSuggestionsCount <= MAX_DEFAULT_SUGGESTIONS) {
                var defaultSuggestion = extraSuggestions.pop();
                if (login === defaultSuggestion.login) continue;

                if (!users[defaultSuggestion.login]) {
                  extraSuggestionsCount++;
                  suggestions.push({
                    login: defaultSuggestion.login,
                    name: defaultSuggestion.name,
                    reason: defaultSuggestion.reason,
                    speaker: !!(speakers.set[login])
                  });
                }
              }

              return suggestions;
            });

        });
    });
};
