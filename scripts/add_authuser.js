var users = require('../lib/db/users');
var tentacles = require('../lib/tentacles');

tentacles.user.getAuthUser().then(function(attrs) {
  return users.create(attrs).then(function(user) {
    var port = process.env.PORT || 3000;
    console.log('Now start this project and visit http://localhost:'+port+'/private/test/update?login='+user.login' in your browser.');
  });
}).catch(function(err) {
  throw err;
});


