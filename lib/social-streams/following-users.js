"use strict";

var TentaclesStreams = require('tentacles-streams');
var es = require('event-stream');

module.exports = function(login, accessToken) {
  /* Options are passed through to the tentacles client. */
  var client = new TentaclesStreams({ accessToken: accessToken });

  /* Creates a ReadableStream in object stream mode. Options are passed through to Tentacles */
  var following;
  if (login) {
    following = client.userFollower.listFollowingForUser(login);
  } else {
    following = client.userFollower.listFollowingForAuthUser();
  }
  return following
    .pipe(es.mapSync(function(user) {
      return {
        login: user.login
      };
    }));
};
