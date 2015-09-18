import Backbone from 'backbone';

export default Backbone.Router.extend({
  routes: {
    '': 'onIndexRoute',
    'login': 'onRouteLoggedIn',
  },
  onIndexRoute: function() {
    require(['../layouts/index-layout'], (IndexLayout) => {
      var indexLayout = new IndexLayout({
        el: '[data-component=application]',
      });
      indexLayout.render();
    });
  },

  onRouteLoggedIn: function() {
    require(['../views/loading-view.js'], (LoadingView) => {
      var loadingView = new LoadingView({
        el: '[data-component=application]',
      });
      loadingView.render();
    });
  },
});
