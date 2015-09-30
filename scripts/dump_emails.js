require('../validate-environment');

var _ = require('underscore');
var db = require('../lib/db');

function quote(v) {
  var s = v.replace('"', '""'); // excel style? or \"?
  if (s) {
    return '"'+s+'"'; // just in case. definitely decessart for ,
  } else {
    return '';
  }
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
