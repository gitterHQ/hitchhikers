"use strict";

var client = require('../tentacles-streams');
var tentacles = require('../tentacles');
var es = require('event-stream');

/* Creates a ReadableStream in object stream mode. Options are passed through to Tentacles */
module.exports = function(login, accessToken) {
  var repos;
  if (login) {
    repos = client.repo.listForUser(login, { accessToken: accessToken, maxPages: 10, query: { sort: 'pushed' } });
  } else {
    repos = client.repo.listForAuthUser({ accessToken: accessToken, maxPages: 10, query: { sort: 'pushed' } });
  }
  return repos
    .pipe(es.map(function(repo, callback) {
      if (!repo.fork) return callback(); // Drop non-forks

      return tentacles.repo.get(repo.full_name)
        .then(function(fullRepo) {
          if (!fullRepo) return;
          return fullRepo.source;
        })
        .catch(function(e) {
          console.error('Unable to load source', e.stack);
        })
        .nodeify(callback);
    }))
    .pipe(es.mapSync(function(repo) {
      return {
        full_name: repo.full_name,
        language: repo.language
      };
    }));
};
