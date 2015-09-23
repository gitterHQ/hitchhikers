"use strict";

var client = require('../tentacles-streams');
var es = require('event-stream');

module.exports = function(login, accessToken) {
  /* Creates a ReadableStream in object stream mode. Options are passed through to Tentacles */
  var watching;
  if (login) {
    watching = client.watching.listForUser(login, { accessToken: accessToken });
  } else {
    watching = client.watching.listForAuthUser({ accessToken: accessToken });
  }
  return watching
    .pipe(es.mapSync(function(repo) {
      return {
        full_name: repo.full_name,
        language: repo.language
      };
    }));
};
