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

  model: new MenuModel({
    isActive: false,
  }),

  modelEvents: {
    'change:isActive':   'onMenuStateChange',
    'change:avatar_url': 'render',
  },

  collection: new Backbone.Collection([
    { name: 'Settings', url: '#settings' },
    { name: 'Log out',  url: '#log-out'},
  ]),

  onMenuTriggerClicked: function(e) {
    this.model.set('isActive', !this.model.get('isActive'));
  },

  onMenuStateChange: function() {
    this.$el.toggleClass('active', this.model.get('isActive'));
  },

});
