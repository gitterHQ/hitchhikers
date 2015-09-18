import querystring        from 'querystring';
import request            from 'superagent';
import apiConfig          from '../../../config/api';

import { getPermissions, setPermissions } from '../services/user-permissions';
import { getUser, setUser }               from '../services/user';

export default function(secret, code) {
  return new Promise(function(resolve, reject) {
    var url = apiConfig.baseURL + apiConfig.clientAuthToken;
    request
      .post(url)
      .send({
        code: code,
      })
      .end((err, res) => {
        if (err) return reject(err);
        if (!res.text) return reject(new Error('No github access key provided'));

        Promise.all([getPermissions(), getUser()])
          .then((results) => {
            //permissions
            var permissions = results[0];
            permissions.accessKey = res.body.access_token;
            return Promise.all([
              setPermissions(permissions),
              setUser(res.body.user),
            ]);
          })
          .then(resolve)
          .catch(reject);
      });
  });
}
