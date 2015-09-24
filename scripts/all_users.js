require('../validate-environment');

var db = require('../lib/db');

db.users.findAll()
  .then(function(users) {
    console.log(users);
  })
  .catch(function(err) {
    console.error(err);
    throw err;
  });



