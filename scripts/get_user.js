require('../validate-environment');

var db = require('../lib/db');

db.users.get("lerouxb")
  .then(function(user) {
    console.log(user);
  })
  .catch(function(err) {
    throw err;
  });
