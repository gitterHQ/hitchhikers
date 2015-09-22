import styles            from '../../css/components/settings.css'
import Marionette        from 'backbone.marionette';
import settingsTemplate  from '../../templates/settings/layout.hbs';

export default Marionette.LayoutView.extend({
  template: settingsTemplate,

  regions: {
    menu: '[data-component="user-menu"]',
  },

});
