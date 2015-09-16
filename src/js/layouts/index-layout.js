import Marionette from 'backbone.marionette';
import layoutTemplate from '../../templates/index/layout.hbs';

export default Marionette.LayoutView.extend({

  template: layoutTemplate,

  initialize: function() {
    console.log('Boooom shaka alaka', this.el);
    this.render();
  },
});
