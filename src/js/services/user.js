import promiseDB  from 'promise-db';
import dbConfig   from '../../../config/indexed';
import request    from 'superagent';

var id = 1;

export var getUser = () => {
  return new Promise((resolve, reject) => {
    promiseDB
      .createDB(dbConfig)
      .then((db) => promiseDB.get(db, 'user', id))
      .then((user) => {
        resolve(user);
      })

      //if we fail here we have no user object
      .catch((err) => {
        resolve(null);
      });
  });
};

export var getUserFromAPI = () => {
  return new Promise((resolve, reject) => {
    request.get('/user').end((err, res) => {
      var user = res.body;
      user.id = id;

      //resolve with the user
      resolve(user);

      //save the user into the local db
      setUser(user);
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
