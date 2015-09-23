import styles           from '../../css/components/menu.css';
import Backbone         from 'backbone';
import Marionette       from 'backbone.marionette';
import { getUser }      from '../services/user.js';
import menuTemplate     from '../../templates/menu/view.hbs';
import menuItemTemplate from '../../templates/menu/item.hbs';

var MenuItemView = Marionette.ItemView.extend({
  tagName: 'li',
  template: menuItemTemplate,
});

var MenuModel = Backbone.Model.extend({
  initialize: function() {
    getUser().then((user) => {
      console.log('user', user);
      this.set(user);
    });
  },
});

export default Marionette.CompositeView.extend({

  template:           menuTemplate,
  childViewContainer: '[data-component="menu-list"]',
  childView:          MenuItemView,

  events: {
    'click [data-component="menu-trigger"]': 'onMenuTriggerClicked',
  },

  model: new MenuModel(),

  modelEvents: {
    'change:login':    'render',
  },

  collection: new Backbone.Collection([
    { name: 'Settings', url: '#settings' },
    { name: 'Log out',  url: '#log-out'},
  ]),

});
