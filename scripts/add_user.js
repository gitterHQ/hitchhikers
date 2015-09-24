var users = require('../lib/db/users');
var tentacles = require('../lib/tentacles');
var queueUserGraphUpdate = require('../lib/graph/queue-update');

tentacles.user.get(process.argv[2])
  .then(function(attrs) {
    return users.create(attrs);
  })
  .then(function(user) {
    return queueUserGraphUpdate(user.login);
  })
  .catch(function(err) {
    throw err;
  });



