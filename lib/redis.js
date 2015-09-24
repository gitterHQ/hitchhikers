var Redis = require('ioredis');
var url = require('url');

exports.create = function() {
  var redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
  return new Redis(redisUrl);
};
