import Q from 'q';
import promiseDB from 'promise-db';
import dbConfig  from '../../../config/indexed.js';

export var getPermissions = () => {
  return Q.Promise((resolve, reject) => {
    //there will only ever be on permissions object so the id is always 1
    promiseDB
      .createDB(dbConfig)
      .then((db) => promiseDB.get(db, 'permissions', 1))
      .then((permissions) => {
        resolve(permissions);
      })

      //assume an error here means there is no permissions object in the database
      .catch((err) => {
        resolve({});
      });
  });
};

export var setPermissions = (permissions) => {
  return Q.Promise((resolve, reject) => {
    promiseDB
      .createDB(dbConfig)
      .then((db) => {
        return promiseDB.put(db, 'permissions', permissions);
      })
      .then(resolve)
      .catch(reject);
  });
};
