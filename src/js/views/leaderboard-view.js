import Marionette              from 'backbone.marionette';
import leaderBoardViewTemplate from '../../templates/leaderboard/view.hbs';
import LeaderBoardItem         from './leaderboard-item-view';

export default Marionette.CompositeView.extend({
  template: leaderBoardViewTemplate,
  childView: LeaderBoardItem,
  childViewContainer: '[data-component="leaderboard-items"]',
  initialize: function() {
    if (this.collection) this.collection.fetch();
  },
});
