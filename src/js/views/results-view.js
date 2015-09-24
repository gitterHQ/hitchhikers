import Marionette from 'backbone.marionette';
import resultsTemplate from '../../templates/results/view.hbs';
import LeaderBoardItem         from './leaderboard-item-view';

export default Marionette.CompositeView.extend({
  template: resultsTemplate,
  childView: LeaderBoardItem,
});
