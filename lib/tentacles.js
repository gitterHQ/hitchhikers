var Tentacles = require('tentacles');

module.exports = new Tentacles({
  anonymousClientId: process.env.GITHUB_CLIENT_ID,
  anonymousClientSecret: process.env.GITHUB_CLIENT_SECRET
});
