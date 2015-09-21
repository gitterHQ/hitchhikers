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
    'change:active': 'onModelUpdate',
  },

  onMenuTriggerClicked: function() {
    this.model.set('active', !this.model.get('active'));
  },

  onModelUpdate: function() {
    $('body').toggleClass('menu-open', this.model.get('active'));
  },
});
