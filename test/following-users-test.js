var followingUsersStream = require('../lib/social-streams/following-users');
var assert = require('assert');

describe('following-users', function() {
  this.timeout(5000);

  it('should return a stream of users the current user follows', function(done) {
    var count = 0;

    followingUsersStream(null, process.env.GITHUB_ACCESS_TOKEN)
      .on('data', function() {
        count++;
      })
      .on('end', function() {
        assert(count > 0);
        done();
      })
      .on('error', function(err) {
        done(err);
      });
  });

});
