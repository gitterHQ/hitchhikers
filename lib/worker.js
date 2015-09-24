'use strict';

var subRedis = require('./redis').create();
var updateUserGraph = require('./graph/update-user-graph');

subRedis.subscribe('gu:import')
  .then(function() {
    console.log('Listening to gu:import messages')
  })
  .catch(function(err) {
    console.error('Unable to subscribe to Redis queue gu:import');
    console.error(err.stack);
  });

subRedis.on('message', function (channel, message) {
  var data;
  try {
    data = JSON.parse(message);
  } catch(e) {
    console.error('Unable to parse message on gu:import: ', message);
    console.error(e.stack);
    return;
  }

  console.log('Updating user graph for login', data.login);
  return updateUserGraph(data.login, data.accessToken)
    .then(function() {
      console.log('Update of user graph for login', data.login, 'completed successfully');
    })
    .catch(function(e) {
      console.error('Unable to process message on gu:import', data);
      console.error(e.stack);
    });
});

process.on('uncaughtException', function(err) {
  console.error(err.stack);
});
