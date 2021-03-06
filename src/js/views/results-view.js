import Marionette from 'backbone.marionette';
import resultsTemplate from '../../templates/results/view.hbs';
import LeaderBoardItem         from './leaderboard-item-view';
import { getUser } from '../services/user';

var ResultsCollection = Backbone.Collection.extend({
  url: '/user/suggestions',
  model: Backbone.Model.extend({
    defaults: {
      shouldShowReason: true,
    },
    initialize: function(attrs) {
      this.set('username', attrs.login);
      this.set('image', `https://avatars.githubusercontent.com/${attrs.login}`);
      this.set('link', `https://github.com/${attrs.login}`);
    },
  }),
});

export default Marionette.CompositeView.extend({

  template: resultsTemplate,
  childView: LeaderBoardItem,
  childViewContainer: '[data-component="results-list"]',
  collection: new ResultsCollection(),
  filter: function(model, index) {
    return index < 12;
  },

  initialize: function() {
    this.collection.fetch();
  },
});
