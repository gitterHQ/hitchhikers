var db = require('../lib/db');

var attrs = {
  login: "lerouxb",
  name: "Le Roux Bodenstein",
  email: "lerouxb@gmail.com"
};

db.users.update("lerouxb", attrs)
  .then(function(user) {
    console.log(user);
  }).catch(function(err) {
    throw err;
  });
