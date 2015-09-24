var _ = require('underscore');
var db = require('../lib/db');
var locations = require('./random-locations.json');

var login = process.argv[2];
var attrs = _.sample(locations);

db.users.update(login, attrs)
  .then(function(user) {
    console.log(user);
  }).catch(function(err) {
    console.error(err);
    throw err;
  });
