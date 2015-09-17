import Backbone from 'backbone';

export default Backbone.Router.extend({
  routes: {
    '': 'onIndexRoute',
  },
  onIndexRoute: function() {
    require(['../layouts/index-layout'], (IndexLayout) => {
      var indexLayout = new IndexLayout({
        el: '[data-component=application]',
      });
      indexLayout.render();
    });
  },
});
