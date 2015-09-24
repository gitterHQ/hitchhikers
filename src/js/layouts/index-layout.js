import styles           from '../../css/components/index-layout.css';
import Marionette       from 'backbone.marionette';
import layoutTemplate   from '../../templates/index/layout.hbs';
import LeadboardLayout  from './leaderboard-layout';

export default Marionette.LayoutView.extend({

  template: layoutTemplate,

  events: {
    'click [data-component=login]': 'onLoginClicked',
  },

  regions: {
    map:          '[data-component="index-layout-map"]',
    leaderBoards: '[data-component="index-layout-leaderboard"]',
  },

  onRender: function() {
    this.leaderBoards.show(new LeadboardLayout());
  },

  onLoginClicked: function() {
    this.trigger('login:clicked');
  },
});
