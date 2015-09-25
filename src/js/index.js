import homeStyles from '../css/home.css';

import Backbone from 'backbone';
import IndexRouter from './routers/index-router';

var router = new IndexRouter();

console.log('checking');
if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/build/serviceWorker.js')
    .then(() => {
      console.log('service worker registered');
    })
    .catch((err) => {
      console.log('-----------------------');
      console.log(err);
      console.log('-----------------------');
    });
}


/*
window.addEventListener('error', (e) => {
  e.preventDefault();
  router.navigate(`/error/${e.message}`);
  return false;
});
*/

Backbone.history.start();
