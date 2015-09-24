'use strict';

var db = require('../db');

module.exports = function(req, res, next) {
  var auth = req.signedCookies.auth;
  if (!auth || !auth.login) {
    return res.send(401);
  }
  db.users.get(auth.login).then(function(user) {
    if (user && user.login == auth.login) {
      req.user = user;
      next();
    } else {
      res.send(401);
    }
  });
};
