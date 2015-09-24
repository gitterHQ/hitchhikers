'use strict';

module.exports = function(req, res, next) {
  if (req.query.secret && req.query.secret == process.env.PRIVATE_SECRET) {
    next();
  } else {
    res.sendStatus(403);
  }
};
