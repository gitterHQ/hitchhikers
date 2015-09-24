'use strict';

var _ = require('underscore');
var exports = module.exports = {};

var attrExists = exports.attrExists = function(attrs) {
  return function(key) {
    return (attrs[key] !== undefined);
  };
};
var attrBlank = exports.attrBlank = function(attrs) {
  return function(key) {
    return (attrs[key] == '');
  };
};

exports.allOrNothing = function(attrs, subset) {
  // either all subset attrs exist or none of them do,
  // either all subset attrs are blank or none of them even exist
  var keys = _.keys(attrs);
  var anyExist = _.any(subset, attrExists(attrs));
  var allExist = _.all(subset, attrExists(attrs));
  console.log("anyExist, allExist", anyExist, allExist);
  if (anyExist && !allExist) {
    attrs = _.omit(attrs, subset)
    keys = _.keys(attrs)
  } else {
    var anyBlank = _.any(subset, attrBlank(attrs));
    var allBlank = _.all(subset, attrBlank(attrs));
    if (anyBlank && !allBlank) {
      attrs = _.omit(attrs, subset)
      keys = _.keys(attrs)
    }
  }
  return attrs;
};
