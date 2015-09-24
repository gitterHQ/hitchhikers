import styles                 from '../../css/components/results.css';
import Backbone               from 'backbone';
import Marionette             from 'backbone.marionette';
import resultsLayoutTemplate  from '../../templates/results/layout.hbs';
import LeadboardLayout        from './leaderboard-layout';
import ResultsView            from '../views/results-view';

var ResultsCollection = Backbone.Collection.extend({
  url: '/user/suggestions',
});

export default Marionette.LayoutView.extend({
  template: resultsLayoutTemplate,
  collection: new ResultsCollection(),

  regions: {
    leaderBoards: '[data-component="index-layout-leaderboard"]',
    results:      '[data-component="results"]',
  },

  initialize: function() {
    if (this.collection) this.collection.fetch();
  },

  onRender: function() {
    this.leaderBoards.show(new LeadboardLayout());
    this.results.show(new ResultsView());
  },
});
