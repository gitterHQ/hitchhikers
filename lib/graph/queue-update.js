'use strict';

var redis = require('../redis').create();
redis.on('connect', function() {
  redis.connector.stream.unref();
});

module.exports = function(login, accessToken) {
  return redis.publish('gu:import', JSON.stringify({ login: login, accessToken: accessToken }));
}
