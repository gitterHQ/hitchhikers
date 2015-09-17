import Backbone             from 'backbone';
import Marionette           from 'backbone.marionette';
import leaderBoardsTemplate from '../../templates/leaderboard/layout.hbs';
import LeaderBoardView      from '../views/leaderboard-view';

export default Marionette.LayoutView.extend({

  template: leaderBoardsTemplate,

  regions: {
    distance: '[data-component="distance-travelled"]',
    locations: '[data-component="locations"]',
    members: '[data-component="members"]',
  },

  onRender: function() {
    this.distance.show(new LeaderBoardView({
      model: new Backbone.Model({ title: 'Lightmiles Traveled' }),
    }));

    this.locations.show(new LeaderBoardView({
      model: new Backbone.Model({ title: 'Hitchhiking Hometowns' }),
    }));

    this.members.show(new LeaderBoardView({
      model: new Backbone.Model({ title: 'Hitchhikers Gathered' }),
    }));
  },
});
