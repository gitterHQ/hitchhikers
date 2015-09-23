import request    from 'superagent';

export default function() {
  return new Promise(function(resolve, reject) {
    request
      .get('/client/key')
      .end((err, res) => {
        if (err) return reject(err);
        resolve(res.text);
      });
  });
}
