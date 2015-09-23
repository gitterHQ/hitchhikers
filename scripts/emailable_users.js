var users = require('../lib/db/users');

users.findEmailable()
  .then(function(users) {
    console.log(users);
  })
  .catch(function(err) {
    console.error(err);
    throw err;
  });



