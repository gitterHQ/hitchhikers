import _                       from 'lodash';
import Marionette              from 'backbone.marionette';
import leaderboarItemTemplate  from '../../templates/leaderboard/item.hbs';

export default Marionette.ItemView.extend({
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

