"use strict";

var client = require('../tentacles-streams');
var es = require('event-stream');

module.exports = function(login, accessToken) {
  /* Creates a ReadableStream in object stream mode. Options are passed through to Tentacles */
  var starred;
  if (login) {
   starred = client.starring.listForUser(login, { accessToken: accessToken, maxPages: 10 });
  } else {
   starred = client.starring.listForAuthUser({ accessToken: accessToken, maxPages: 10 });
  }
  return starred
    .pipe(es.mapSync(function(repo) {
      return {
        full_name: repo.full_name,
        language: repo.language
      };
    }));
};
