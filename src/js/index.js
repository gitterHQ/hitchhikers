import homeStyles from '../css/home.css';

import Backbone from 'backbone';
import IndexRouter from './routers/index-router';

var router = new IndexRouter();

window.addEventListener('error', (e) => {
  e.preventDefault();
  router.navigate(`/error/${e.message}`);
  return false;
});

Backbone.history.start();
