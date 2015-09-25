"use strict";

var client = require('../tentacles-streams');
var es = require('event-stream');

module.exports = function(login, accessToken) {
  /* Creates a ReadableStream in object stream mode. Options are passed through to Tentacles */
  var following;
  if (login) {
    following = client.userFollower.listFollowingForUser(login, { accessToken: accessToken, maxPages: 10 });
  } else {
    following = client.userFollower.listFollowingForAuthUser({ accessToken: accessToken, maxPages: 10 });
  }
  return following
    .pipe(es.mapSync(function(user) {
      return {
        login: user.login
      };
    }));
};
