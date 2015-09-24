'use strict';

var TentaclesStreams = require('tentacles-streams');

module.exports = new TentaclesStreams({
  anonymousClientId: process.env.GITHUB_CLIENT_ID,
  anonymousClientSecret: process.env.GITHUB_CLIENT_SECRET
});
