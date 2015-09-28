'use strict';

var SPEAKERS = [
  'defunkt',
  'sanoursa',
  'tracicakes',
  'loranallensmith',
  'sinbad',
  'brntbeer',
  'igor47',
  'caabernathy',
  'mcolyer',
  'theopolis',
  'suryagaddipati',
  'kakuls',
  'solarissmoke',
  'dmittman',
  'bkeepers',
  'peterbell',
  'benbalter',
  'kellan',
  'nmsanchez',
  'mtesselH',
  'jlord',
  'joshk',
  'pmotch',
  'kdaigle',
  'patrickmckenna',
  'mykmelez',
  'mogox',
  'larsxschneider',
  'mastahyeti',
  'loopj'
];

var SPEAKERS_SET = SPEAKERS.reduce(function(memo, login) {
  memo[login] = true;
  return memo;
}, {});

module.exports = {
  list: SPEAKERS,
  set: SPEAKERS_SET
};
