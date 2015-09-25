"use strict";

var client = require('../tentacles-streams');
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
    .pipe(es.mapSync(function(repo) {
      if (repo.fork) return; // Drop forks
      return {
        full_name: repo.full_name,
        language: repo.language
      };
    }));
};
