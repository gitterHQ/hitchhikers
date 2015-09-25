import Q from 'q';
import querystring        from 'querystring';
import request            from 'superagent';

import { getPermissions, setPermissions } from '../services/user-permissions';
import { getUser, setUser }               from '../services/user';

export default function(secret, code) {
  return Q.Promise(function(resolve, reject) {
    var url = '/client/token';
    request
      .post(url)
      .send({
        code: code,
      })
      .end((err, res) => {
        if (err) return reject(err);
        if (!res.text) return reject(new Error('No github access key provided'));

        Q.all([getPermissions(), getUser()])
          .then((results) => {
            //permissions
            var permissions = results[0];
            permissions.accessKey = res.body.access_token;
            return Q.all([
              setPermissions(permissions),
              setUser(res.body.user),
            ]);
          })
          .then(resolve)
          .catch(reject);
      });
  });
}
