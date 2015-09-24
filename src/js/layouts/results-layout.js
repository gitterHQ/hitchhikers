import styles from '../../css/components/results.css';
import Marionette from 'backbone.marionette';
import resultsLayoutTemplate from '../../templates/results/layout.hbs';
import LeadboardLayout  from './leaderboard-layout';

export default Marionette.LayoutView.extend({
  template: resultsLayoutTemplate,
  regions: {
    leaderBoards: '[data-component="index-layout-leaderboard"]',
    suggestions: '[data-component="suggestions"]'
  },
  onRender: function() {
    this.leaderBoards.show(new LeadboardLayout());
  },
});
