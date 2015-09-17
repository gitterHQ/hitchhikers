import Marionette from 'backbone.marionette';
import leaderBoardViewTemplate from '../../templates/leaderboard/view.hbs';

export default Marionette.CompositeView.extend({
  template: leaderBoardViewTemplate
});
