import request    from 'superagent';
import apiConfig  from '../../../config/api.js';

export default function() {
  return new Promise(function(resolve, reject) {
    request
      .get(apiConfig.baseURL + apiConfig.clientSecrentKey)
      .end((err, res) => {
        if (err) return reject(err);
        resolve(res.text);
      });
  });
}
