import Marionette       from 'backbone.marionette';
import settingTemplate  from '../../templates/settings/layout.hbs';
import MenuView         from '../views/menu-view.js';

export default Marionette.LayoutView.extend({
  template: settingTemplate,

  regions: {
    menu: '[data-component="user-menu"]',
  },

  onRender: function() {
    console.log('RENDER');
    this.menu.show(new MenuView());
  },

});
