import promiseDB  from 'promise-db';
import dbConfig   from '../../../config/indexed';

var id = 1;

export var getUser = () => {
  return new Promise((resolve, reject) => {
    promiseDB
      .createDB(dbConfig)
      .then((db) => promiseDB.get(db, 'user', id))
      .then((user) => {
        resolve(user);
      })
      .catch((err) => {
        resolve({});
      });

  });
};

export var setUser = (user) => {
  user.id = id;
  return new Promise((resolve, reject) => {
    promiseDB
     .createDB(dbConfig)
     .then((db) => promiseDB.put(db, 'user', user))
     .then(resolve)
     .catch(reject);

  });
};
