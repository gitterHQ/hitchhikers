import homeStyles   from '../css/home.css';
import sync         from './utils/sync';
import Backbone     from 'backbone';
import IndexRouter  from './routers/index-router';

new IndexRouter();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/build/service.js')
    .catch((err) => {
      console.log('-----------------------');
      console.log(err);
      console.log('-----------------------');
    });
}

Backbone.history.start();
