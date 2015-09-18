import promiseDB  from 'promise-db';
import dbConfig   from '../../../config/indexed';

export var getUser = () => {
  return new Promise((resolve, reject) => {
    promiseDB
      .createDB(dbConfig)
      .then((db) => promiseDB.get(db, 'user', 1))
      .then((user) => {
        resolve(user);
      })
      .catch((err) => {
        resolve({});
      });

  });
};

export var setUser = (user) => {
  return new Promise((resolve, reject) => {
    promiseDB
     .createDB(dbConfig)
     .then((db) => promiseDB.put(db, 'user', user))
     .then(resolve)
     .catch(reject);

  });
};
