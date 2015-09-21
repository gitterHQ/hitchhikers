import Marionette       from 'backbone.marionette';
import settingTemplate  from '../../templates/settings/layout.hbs';

export default Marionette.LayoutView.extend({
  template: settingTemplate,

  regions: {
    menu: '[data-component="user-menu"]',
  },

  onRender: function() {
  },

});
