import promiseDB from 'promise-db';
import dbConfig  from '../../../config/indexed.js';

export var getPermissions = () => {
  return new Promise((resolve, reject) => {
    //there will only ever be on permissions object so the id is always 1
    promiseDB
      .createDB(dbConfig)
      .then((db) => promiseDB.get(db, 'permissions', 1))
      .then((permissions) => {
        resolve(permissions);
      })
      .catch((err) => {
        resolve({});
      });
  });
};

export var setPermissions = (permissions) => {
  return new Promise((resolve, reject) => {
    promiseDB
      .createDB(dbConfig)
      .then((db) => {
        return promiseDB.put(db, 'permissions', permissions);
      })
      .then(resolve)
      .catch(reject);
  });
};
