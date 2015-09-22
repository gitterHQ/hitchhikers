var _ = require('underscore');
var users = require('../lib/db/users');
var cypher = require('../lib/utils/cypher');
var assert = require('assert');
var neo4jClient = require('../lib/db/neo4jclient')

// test data
var attrs = {
  login: 'lerouxb',
  name: 'Le Roux Bodenstein'
};

describe('blank database', function() {
  beforeEach(function() {
    return cypher.flushDB(neo4jClient);
  });

  it('should add a new user', function() {
    return users.create(attrs).then(function() {
      return users.get(attrs.login).then(function(user) {
        assert.equal(user.login, attrs.login);
      });
    });
  });

  it('should return null when getting a user that does not exist', function() {
    return users.get('gibberish').then(function(user) {
      assert.equal(user, null);
    });
  });

  it('should return null when updating a user that does not exist', function() {
    return users.update('gibberish', attrs).then(function(user) {
      assert.equal(user, null);
    });
  });

  it('should return null when deleting a user that does not exist', function() {
    return users.destroy('gibberish').then(function(user) {
      assert.equal(user, null);
    });
  });
});

describe('populated database', function() {
  beforeEach(function() {
    return cypher.flushDB(neo4jClient).then(function() {
      return users.create(attrs);
    });
  });

  it('should merge when adding a user that already exists', function() {
    return users.create(attrs).then(function() {
      var query = "MATCH (user { login: {login} }) RETURN user";
      return neo4jClient.query(query, {login: attrs.login}).then(function(response) {
        // only one result
        assert.equal(response.data.length, 1);
        assert.equal(response.data[0].length, 1);
      });
    });
  });

  it('should get the user', function() {
    return users.get(attrs.login).then(function(user) {
      assert.equal(user.login, attrs.login);
    });
  });

  it('should update the user', function() {
    var newAttrs = _.defaults({email: "lerouxb@gmail.com"}, attrs);
    return users.update(attrs.login, newAttrs).then(function(user) {
      assert.equal(user.email, newAttrs.email);
    });
  });

  it('should return just the login when deleting the user', function() {
    return users.destroy(attrs.login).then(function(user) {
      assert.deepEqual(_.keys(user), ['login']);
    });
  });

  it('should upgrade users that are already in the graph', function() {
    // If someone is being followed by someone else, then there is already a
    // user record that just has the login. OR if a user deleted their details,
    // then signed in again it should be able to add them again.
    return users.destroy(attrs.login)
      .then(function(user) {
        return users.create(attrs)
      })
      .then(function(user) {
        assert.equal(user.name, attrs.name);
      });
  });
});

