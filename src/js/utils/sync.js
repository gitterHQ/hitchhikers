import $ from 'jquery';
import Backbone from 'backbone';
import _ from 'lodash';
import promiseDB from 'promise-db';
import dbConfig from '../../../config/indexed';

var limit = 60000;
var count = 0;
var oldSync = Backbone.sync;

Backbone.sync = function(method, obj, options) {

  obj.name = (obj.name || (count += 1));

  return promiseDB
    .createDB(dbConfig)
    .then((db) => promiseDB.getCollection(db, 'results', 'owner', obj.name))
    .then((results) => {
      if (!results.length) {

        //save the old callback
        var callback = options.success;

        //override the callback
        options.success = function(results) {
          promiseDB
            .createDB(dbConfig)
            .then((db) => promiseDB.put(db, 'results', results.map((result) => {

              //add the ownder index
              var t = _.extend({}, result, {
                owner: obj.name,
                setTime: +new Date(),
              });

              return t;
            })))
            .then(() => callback(results))
            .catch((err) => options.error(err));
        };

        //make a request
        oldSync.apply(this, arguments);
      } else {

        var diffTime = +new Date() - results[0].setTime;
        if (diffTime >= limit) {

          //if we have an error at this point just return the old results
          options.error = function() {
            options.success(uniq(results));
          };

          oldSync.apply(this, arguments);
        } else {

          //if we have results resolve with them
          options.success(uniq(results));
        }
      }
    })
    .catch((err) => {
      options.error(err);
    });
};

function uniq(arr) {
  var store = {};
  arr.forEach((item) => {
    store[(item.login || item.code)] = item;
  });
  return Object.keys(store).map((key) => {
    return store[key];
  });
}
