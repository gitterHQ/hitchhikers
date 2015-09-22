var users = require('../lib/db/users');

var attrs = {
  login: "lerouxb",
  name: "Le Roux Bodenstein",
  email: "lerouxb@gmail.com"
};

users.update("lerouxb", attrs)
  .then(function(user) {
    console.log(user);
  }).catch(function(err) {
    throw err;
  });
