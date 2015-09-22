var request = require('request');
var Promise = require('bluebird');
var querystring = require('querystring');

var exports = module.exports = {};

exports.getAccessToken = function(code) {
  var url = 'https://github.com/login/oauth/access_token?'+
    '&client_id='+process.env.GITHUB_CLIENT_ID+
    '&client_secret='+process.env.GITHUB_CLIENT_SECRET+
    '&code='+code;

  return new Promise(function(resolve, reject) {
    request(url, function(err, response, body) {
      if (err) {
        reject(err);
      } else {
        resolve(querystring.parse(body));
      }
    });
  });
};
