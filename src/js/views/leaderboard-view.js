import _                       from 'lodash';
import Marionette              from 'backbone.marionette';
import leaderBoardViewTemplate from '../../templates/leaderboard/view.hbs';
import leaderboarItemTemplate  from '../../templates/leaderboard/item.hbs';

var LeaderBoardItem = Marionette.ItemView.extend({
  tagName: 'li',
  className: 'leaderboard__items__item',
  template: leaderboarItemTemplate,
  serializeData: function() {
    var model = this.model;
    return _.extend({}, model.toJSON(), {
      username: (model.get('username') || model.get('country')),
    });
  },
});

export default Marionette.CompositeView.extend({
  template: leaderBoardViewTemplate,
  childView: LeaderBoardItem,
  childViewContainer: '[data-component="leaderboard-items"]',
  initialize: function() {
    if (this.collection) this.collection.fetch();
  },
});
