var _ = require('underscore');
var db = require('../lib/db');

db.users.getSuggestions(process.argv[2] || 'lerouxb')
  .then(function(results) {
    console.log(JSON.stringify(results, null, 2));
  })
  .catch(function(err) {
    console.error(err);
    throw err;
  });
