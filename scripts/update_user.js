'use strict';

var db = require('../lib/db');

var attrs = {
  email: "lerouxb@gmail.com",
  code: '',
  country: '',
  city: '',
  lon: '',
  lat: '',
};

db.users.update("lerouxb", attrs)
  .then(function(user) {
    console.log(user);
  }).catch(function(err) {
    throw err;
  });
