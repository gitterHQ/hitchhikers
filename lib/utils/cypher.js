var _ = require('underscore');

var exports = module.exports = {};

exports.escape = function(str) {
  return str.replace('"', '""');
};

exports.formatAttrs = function(attrs) {
  var joined = _.map(attrs, function(v, k) {
    return k+': {'+k+'}';
  }).join(',');
  return joined;
};

exports.getResponseData = function(response, flatten) {
  var objects = [];
  _.each(response.data, function(items) {
    if (flatten) {
      // normally useful for just getting a single column
      _.each(items, function(item) {
        objects.push(item.data);
      });
    } else {
      objects.push(_.object(response.columns, items));
    }
  });
  return objects;
};

exports.getResponseOrNull = function(response) {
  var data = exports.getResponseData(response, true);
  if (data.length == 1) {
    var first = data[0];
    return first;
  } else {
    return null;
  }
};

exports.extractIdFromURL = function(url) {
  return url.split('/').pop();
};

exports.flushDB = function(client) {
  var query = 'MATCH (n) '+
              'OPTIONAL MATCH (n)-[r]-() '+
              'DELETE n,r';
  return client.query(query);
};

