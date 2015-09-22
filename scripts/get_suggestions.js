var _ = require('underscore');
var users = require('../lib/db/users');

users.getSuggestions(process.argv[2] || 'lerouxb')
  .then(function(results) {
    console.log(JSON.stringify(results, null, 2));
  })
  .catch(function(err) {
    console.error(err);
    throw err;
  });
