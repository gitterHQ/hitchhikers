require('../validate-environment');

var db = require('../lib/db');
var tentacles = require('../lib/tentacles');
var updateUserGraph = require('../lib/graph/update-user-graph');

tentacles.user.get(process.argv[2])
  .then(function(attrs) {
    delete attrs.email;
    return db.users.create(attrs);
  })
  .then(function(user) {
    return updateUserGraph(user.login);
  })
  .done();
