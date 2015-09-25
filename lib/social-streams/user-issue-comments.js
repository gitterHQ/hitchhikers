"use strict";

var client = require('../tentacles-streams');
var es = require('event-stream');
var tentacles = require('../tentacles');

/* Creates a ReadableStream in object stream mode. Options are passed through to Tentacles */
module.exports = function(login, accessToken) {
  var uniq = {};

  return client.events.listPublicEventsForUser(login, { accessToken: accessToken, maxPages: 10 })
    .pipe(es.map(function(event, callback) {
      if (event.type !== 'IssueCommentEvent' ||
          !event.payload ||
          event.payload.action !== 'created' ||
          !event.repo ||
          !event.repo.name) return callback();

      if (uniq[event.repo.name]) return callback();
      uniq[event.repo.name] = 1;

      return tentacles.repo.get(event.repo.name)
        .then(function(repo) {
          if (!repo) return;

          return {
            full_name: repo.full_name,
            language: repo.language
          };
        })
        .catch(function(e) {
          console.error('Unable to load issue repo', e.stack);
        })
        .nodeify(callback);

    }));
};
