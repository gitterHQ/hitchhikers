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
      this.set('country', attrs.country);
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
      this.set('username', attrs.username);
      this.set('count', Math.round(attrs.distance / 1600));
      this.set('image', `https://avatars.githubusercontent.com/${attrs.username}`);
      this.set('link', `https://github.com/${attrs.username}`);
    },
  }),
  filter: function(model, index) {
    return index < 5;
  },
});

var RepoCollection = Backbone.Collection.extend({
  url: '/leaderboards/repo',
  model: Backbone.Model.extend({
    initialize: function(attrs) {
      this.set('icon', 'repo');
      this.set('link', `https://github.com/${attrs.repoFullName}`);
      this.set('username', attrs.repoFullName);
      this.set('count', attrs.score);
    },
  }),
});

var LanguagesCollection = Backbone.Collection.extend({
  url: '/leaderboards/repo-languages',
  model: Backbone.Model.extend({
    initialize: function(attrs) {
      this.set('icon', 'file-code');
      this.set('username', attrs.repoLanguage);
      this.set('count', attrs.score);
    },
  }),
});

export default Marionette.LayoutView.extend({
  template: leaderBoardsTemplate,

  regions:     {
    distance:  '[data-component="distance-travelled"]',
    locations: '[data-component="locations"]',
    repos:     '[data-component="repos"]',
    languages: '[data-component="languages"]',
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

    this.repos.show(new LeaderBoardView({
      model:      new Backbone.Model({ title: 'Most Popular Repos' }),
      collection: new RepoCollection(),
    }));

    this.languages.show(new LeaderBoardView({
      model:      new Backbone.Model({ title: 'Most Popular Languages' }),
      collection: new LanguagesCollection(),
    }));

  },
});
