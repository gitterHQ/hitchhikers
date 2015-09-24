import Marionette from 'backbone.marionette';
import resultsTemplate from '../../templates/results/view.hbs';
import LeaderBoardItem         from './leaderboard-item-view';

var ResultsCollection = Backbone.Collection.extend({
  url: '/user/suggestions',
  model: Backbone.Model.extend({
    initialize: function(attrs) {
      this.set('username', attrs.login);
    },
  }),
});

export default Marionette.CompositeView.extend({

  template: resultsTemplate,
  childView: LeaderBoardItem,
  childViewContainer: '[data-component="results-list"]',
  collection: new ResultsCollection(),

  initialize: function() {
    this.collection.fetch();
    window.collection = this.collection;
  },
});
