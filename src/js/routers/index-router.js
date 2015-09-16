import Backbone from 'backbone';

export default Backbone.Router.extend({
  routes: {
    '': 'onIndexRoute',
  },
  onIndexRoute: () => {
    console.log('this is working');
  },
});
