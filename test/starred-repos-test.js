var starredReposStream = require('../lib/social-streams/starred-repos');
var assert = require('assert');

describe('starred-repos', function() {
  this.timeout(5000);

  it('should return a stream of repos the current user has followed', function(done) {
    var count = 0;

    starredReposStream(null, process.env.GITHUB_ACCESS_TOKEN)
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
