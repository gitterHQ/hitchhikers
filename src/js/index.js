import homeStyles from '../css/home.css';

import Backbone from 'backbone';
import IndexRouter from './routers/index-router';

var router = new IndexRouter();

Backbone.history.start();
