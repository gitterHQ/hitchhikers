import Backbone         from 'backbone';
import Marionette       from 'backbone.marionette';
import { getUser }      from '../services/user.js';
import menuTemplate     from '../../templates/menu/view.hbs';
import menuItemTemplate from '../../templates/menu/item.hbs';

var MenuItemView = Marionette.ItemView.extend({
  tagName: 'li',
  className: 'menu__item',
  template: menuItemTemplate,
});

var MenuModel = Backbone.Model.extend({
  defaults: {
    avatar_url: 'http://placehold.it/50x50',
  },
  initialize: function() {
    getUser().then((user) => {
      console.log(this);
      this.set(user);
    });
  },
});

export default Marionette.CompositeView.extend({

  template:           menuTemplate,
  childViewContainer: '[data-component="menu-list"]',
  childView:          MenuItemView,

  model: new MenuModel(),
  modelEvents: {
    'change': 'render',
  },

  collection: new Backbone.Collection([
    { name: 'Settings', url: '#settings' },
    { name: 'Log out',  url: '#log-out'},
  ]),

});
