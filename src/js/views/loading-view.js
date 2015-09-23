import Marionette from 'backbone.marionette';
import loadingTemplate from '../../templates/loading/view.hbs';

export default Marionette.ItemView.extend({
  template: loadingTemplate
});
