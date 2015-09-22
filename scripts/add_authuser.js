var users = require('../lib/db/users');
var Tentacles = require('tentacles');
var tentacles = new Tentacles({ accessToken: process.env.GITHUB_ACCESS_TOKEN });

tentacles.user.getAuthUser().then(function(attrs) {
  return users.create(attrs).then(function(user) {
    var port = process.env.PORT || 3000;
    console.log('Now start this project and visit http://localhost:'+port+'/private/test/update?login='+user.login+'&access_token='+process.env.GITHUB_ACCESS_TOKEN+' in your browser.');
  });
}).catch(function(err) {
  throw err;
});


