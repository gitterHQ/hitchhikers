import styles               from '../../css/components/leaderboard.css';
import Backbone             from 'backbone';
import Marionette           from 'backbone.marionette';
import leaderBoardsTemplate from '../../templates/leaderboard/layout.hbs';
import LeaderBoardView      from '../views/leaderboard-view';

var CountryCollection = Backbone.Collection.extend({
  url: '/leaderboards/city',
  model: Backbone.Model.extend({
    initialize: function(attrs) {
      this.set('image', `/images/flags/${attrs.code.toLowerCase()}.png`);
      this.set('username', attrs.city);
    },
  }),
  filter: function(model, index) {
    return index < 5;
  },
});

var DistanceCollection = Backbone.Collection.extend({
  url: '/leaderboards/distance',
  model: Backbone.Model.extend({
    initialize: function(attrs) {
      this.set('username', attrs.login);
      this.set('count', Math.round(attrs.distance / 1600));
      this.set('image', `https://avatars.githubusercontent.com/${attrs.username}`);
      this.set('link', `https://github.com/${attrs.login}`);
    },
  }),
  filter: function(model, index) {
    return index < 5;
  },
});

export default Marionette.LayoutView.extend({
  template: leaderBoardsTemplate,

  regions:     {
    distance:  '[data-component="distance-travelled"]',
    locations: '[data-component="locations"]',
  },

  onRender: function() {
    this.distance.show(new LeaderBoardView({
      model:      new Backbone.Model({ title: 'Miles Traveled' }),
      collection: new DistanceCollection(),
    }));

    this.locations.show(new LeaderBoardView({
      model:      new Backbone.Model({ title: 'Hitchhiking Hometowns' }),
      collection: new CountryCollection(),
    }));
  },
});
