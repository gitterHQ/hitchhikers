import Marionette from 'backbone.marionette';
import menuTriggerTemplate from '../../templates/menu/trigger.hbs';

export default Marionette.ItemView.extend({
  template: menuTriggerTemplate,
});
