require('../validate-environment');

// USAGE:
// node get_random_locations.js > random-locations.json


var geocoder = require('node-geocoder')('openstreetmap', 'http', {
  language: 'en'
});

var async = require('async');
var _ = require('underscore');

var locations = [
  'Shanghai',
  'Karachi',
  'Beijing',
  'Tianjin',
  'Istanbul',
  'Lagos',
  'Tokyo',
  'Guangzhou',
  'Mumbai',
  'Moscow',
  'Dhaka',
  'Cairo',
  'Sao Paulo',
  'Shanzhen',
  'Seoul',
  'Lahore',
  'Jakarta',
  'Kinshasa',
  'Mexico City',
  'New York City',
  'London',
  'San Francisco',
  'Paris',
  'Berlin',
  'Hong Kong'
];

async.map(locations, _.bind(geocoder.geocode, geocoder), function(err, responses) {
  if (err) throw err;

  var cities = [];
  _.each(responses, function(response) {
    if (response.length > 0 && response[0].city) {
      var first = response[0];
      cities.push({
        lat: first.latitude,
        lon: first.longitude,
        city: first.city,
        country: first.country,
        code: first.countryCode
      });
    }
  });
  console.log(JSON.stringify(cities, null, 2));
});

