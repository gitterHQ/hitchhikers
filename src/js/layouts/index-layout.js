import Marionette from 'backbone.marionette';
import layoutTemplate from '../../templates/index/layout.hbs';
import LeadboardLayout from './leaderboard-layout';

export default Marionette.LayoutView.extend({

  template: layoutTemplate,

  regions: {
    map:          '[data-component="index-layout-map"]',
    leaderBoards: '[data-component="index-layout-leaderboard"]',
  },

  onRender: function() {
    this.leaderBoards.show(new LeadboardLayout());
  },
});
