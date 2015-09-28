require('../validate-environment');

var usersSuggestions = require('../lib/db/users-suggestions');

usersSuggestions(process.argv[2], { maxSuggestions: 100 })
  .then(function(results) {
    console.log(results.map(function(suggestion) {
      return suggestion.login + ',' + suggestion.reason;
    }).join('\n'))
  })
  .done();
