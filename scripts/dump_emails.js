require('../validate-environment');

var _ = require('underscore');
var db = require('../lib/db');

function quote(v) {
  return v.replace('"', '""'); // excel style? or \"?
}

db.users.findEmailable()
  .then(function(users) {
    console.log(db.users.USER_ATTRIBUTES.join(',')); // headers
    _.each(users, function(user) {
      var row = _.map(db.users.USER_ATTRIBUTES, function(k) {
        return quote(''+(user[k] || ''));
      });
      console.log(row.join(','));
    });
  })
  .catch(function(err) {
    throw err;
  });
