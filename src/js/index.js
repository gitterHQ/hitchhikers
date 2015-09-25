import homeStyles from '../css/home.css';

import Backbone from 'backbone';
import IndexRouter from './routers/index-router';

new IndexRouter();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/build/service.js')
    .then(() => {
      console.log('service worker registered again 3');
    })
    .catch((err) => {
      console.log('-----------------------');
      console.log(err);
      console.log('-----------------------');
    });
}

Backbone.history.start();
