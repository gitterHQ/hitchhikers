"use strict";

var TentaclesStreams = require('tentacles-streams');
var es = require('event-stream');

module.exports = function(login, accessToken) {
  /* Options are passed through to the tentacles client. */
  var client = new TentaclesStreams({ accessToken: accessToken });

  /* Creates a ReadableStream in object stream mode. Options are passed through to Tentacles */
  var watching;
  if (login) {
    watching = client.watching.listForUser(login);
  } else {
    watching = client.watching.listForAuthUser();
  }
  return watching
    .pipe(es.mapSync(function(repo) {
      return {
        full_name: repo.full_name,
        language: repo.language
      };
    }));
};
