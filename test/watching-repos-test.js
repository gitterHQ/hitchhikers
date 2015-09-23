var watchingReposStream = require('../lib/social-streams/watching-repos');
var assert = require('assert');

describe('watching-repos', function() {
  this.timeout(5000);

  it('should return a stream of repos the current user watches', function(done) {
    var count = 0;

    watchingReposStream('lerouxb')
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
