var users = require('../lib/db/users');

users.destroy("lerouxb")
  .catch(function(err) {
    throw err;
  });
