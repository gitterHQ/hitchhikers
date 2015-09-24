require('../validate-environment');

var db = require('../lib/db');

db.users.destroy("lerouxb")
  .catch(function(err) {
    throw err;
  });
