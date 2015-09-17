import Marionette from 'backbone.marionette';
import leaderBoardsTemplate from '../../templates/leaderboard/layout.hbs';

export default Marionette.LayoutView.extend({

  template: leaderBoardsTemplate,

  initialize: function() {
    console.log('-----------------------');
    console.log('this is working mofo');
    console.log('-----------------------');
  },
});
