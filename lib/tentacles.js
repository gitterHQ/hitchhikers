var Tentacles = require('tentacles');

console.log('-----------------------');
console.log(process.env.GITHUB_CLIENT_ID,process.env.GITHUB_CLIENT_SECRET);
console.log('-----------------------');

module.exports = new Tentacles({
  anonymousClientId: process.env.GITHUB_CLIENT_ID,
  anonymousClientSecret: process.env.GITHUB_CLIENT_SECRET
});
