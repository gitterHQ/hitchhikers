'use strict';

var redis = require('../redis').create();

module.exports = function(login, accessToken) {
  return redis.publish('gu:import', JSON.stringify({ login: login, accessToken: accessToken }));
}
