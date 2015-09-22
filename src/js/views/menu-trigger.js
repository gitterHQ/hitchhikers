import $          from 'jquery';
import Backbone   from 'backbone';
import Marionette from 'backbone.marionette';
import menuTriggerTemplate from '../../templates/menu/trigger.hbs';

export default Marionette.ItemView.extend({
  template: menuTriggerTemplate,
  model: new Backbone.Model({ active: false }),
  events: {
    'click': 'onMenuTriggerClicked',
  },
  modelEvents: {
    'change:active': 'onModelActiveUpdate',
    'change:hidden': 'onModelHiddenUpdate',
  },

  onMenuTriggerClicked: function() {
    this.model.set({
      active: !this.model.get('active'),
      hidden: false,
    });
  },

  onModelActiveUpdate: function() {
    $('body').toggleClass('menu-open', this.model.get('active'));
  },

  onModelHiddenUpdate: function() {
    this.$el.toggleClass('hidden', this.model.get('hidden'));
  },

  close: function() {
    this.model.set('active', false);
  },

  hide: function() {
    this.model.set('hidden', true);
  },
});
