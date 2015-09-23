var users = require('../lib/db/users');

users.findLocatable()
  .then(function(users) {
    console.log(users);
  })
  .catch(function(err) {
    console.error(err);
    throw err;
  });



