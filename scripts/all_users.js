var users = require('../lib/db/users');

users.findAll()
  .then(function(users) {
    console.log(users);
  })
  .catch(function(err) {
    console.error(err);
    throw err;
  });



