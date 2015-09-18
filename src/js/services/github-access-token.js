import querystring        from 'querystring';
import request            from 'superagent';
import { getPermissions, setPermissions } from '../services/user-permissions';
console.log('-----------------------');
console.log(getPermissions);
console.log('-----------------------');
import apiConfig          from '../../../config/api';

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
        getPermissions()
          .then((permissions) => {
            permissions.accessKey = res.text;
            return setPermissions(permissions);
          })
          .then(resolve)
          .catch(reject);
      });
  });
}
