import styles                 from '../../css/components/results.css';
import Marionette             from 'backbone.marionette';
import resultsLayoutTemplate  from '../../templates/results/layout.hbs';
import LeadboardLayout        from './leaderboard-layout';
import ResultsView            from '../views/results-view';

export default Marionette.LayoutView.extend({
  template: resultsLayoutTemplate,

  regions: {
    leaderBoards: '[data-component="index-layout-leaderboard"]',
    results:      '[data-component="results"]',
  },

  onRender: function() {
    this.leaderBoards.show(new LeadboardLayout());
    this.results.show(new ResultsView());
  },
});
