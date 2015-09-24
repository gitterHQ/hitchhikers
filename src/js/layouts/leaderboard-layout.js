import styles               from '../../css/components/leaderboard.css';
import Backbone             from 'backbone';
import Marionette           from 'backbone.marionette';
import leaderBoardsTemplate from '../../templates/leaderboard/layout.hbs';
import LeaderBoardView      from '../views/leaderboard-view';

var CountryCollection = Backbone.Collection.extend({
  url: '/leaderboards/country',
});

var DistanceCollection = Backbone.Collection.extend({
  url: '/leaderboards/distance',
});


export default Marionette.LayoutView.extend({
  template: leaderBoardsTemplate,

  regions:     {
    distance:  '[data-component="distance-travelled"]',
    locations: '[data-component="locations"]',
  },

  onRender: function() {
    this.distance.show(new LeaderBoardView({
      model:      new Backbone.Model({ title: 'Lightmiles Traveled' }),
      collection: new DistanceCollection(),
    }));

    var locationsCollection =     this.locations.show(new LeaderBoardView({
      model:      new Backbone.Model({ title: 'Hitchhiking Hometowns' }),
      collection: new CountryCollection(),
    }));
  },
});
