import url                      from 'url';
import querystring              from 'querystring';
import Backbone                 from 'backbone';
import clientSecretService      from '../services/client-secret';
import githubAccessTokenService from '../services/github-access-token';
import { getPermissions }       from '../services/user-permissions';

export default Backbone.Router.extend({

  routes: {
    '':                 'onIndexRoute',
    'login':            'onRouteLoggedIn',
    'error/:errorType': 'onRouteError',
  },

  //Index page
  onIndexRoute: function() {
    getPermissions()
      .then((permissions) => {
        if (permissions.accessKey) {
          //logged in
        }
        //If we are not logged in show the home page
        else {
          require(['../layouts/index-layout'], (IndexLayout) => {
            var indexLayout = new IndexLayout({
              el: '[data-component=application]',
            });
            indexLayout.render();
          });
        }
      });
  },

  //Post login view
  onRouteLoggedIn: function() {

    var parsedUrl = url.parse(window.location.href);
    var query     = querystring.parse(parsedUrl.query);
    if (!query || !query.code) return this.navigate('/error/no-code-returned-from-github');

    require(['../views/loading-view.js'], (LoadingView) => {
      var loadingView = new LoadingView({
        el: '[data-component=application]',
      });
      loadingView.render();
      clientSecretService()
        .then((key) => {
          return githubAccessTokenService(key, query.code);
        })
        .then(() => {
          this.navigate('', { trigger: true });
        })
        .catch((err) => {
          this.navigate(`/error/${err.message}`);
        });
    });
  },

  onRouteError: function(err) {
    //TODO ADD ERROR STATE
    console.log('-----------------------');
    console.log(err);
    console.log('-----------------------');
  },

});
