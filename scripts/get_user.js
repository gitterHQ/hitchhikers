var users = require('../lib/db/users');

users.get("lerouxb")
  .then(function(user) {
    console.log(user);
  })
  .catch(function(err) {
    throw err;
  });
