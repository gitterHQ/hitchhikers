import url                      from 'url';
import querystring              from 'querystring';
import Backbone                 from 'backbone';
import promiseDB                from 'promise-db';
import clientSecretService      from '../services/client-secret';
import githubAccessTokenService from '../services/github-access-token';
import { getPermissions }       from '../services/user-permissions';
import dbConfig                 from '../../../config/indexed';

export default Backbone.Router.extend({

  routes: {
    '':                 'onIndexRoute',
    'login':            'onRouteLoggedIn',
    'log-out':          'onRouteLogOut',
    'error/:errorType': 'onRouteError',
  },

  //Index page
  onIndexRoute: function() {
    getPermissions()
      .then((permissions) => {
        //if we already have an access key don't show the index page
        //as the user is already logged in
        if (permissions.accessKey) {
          //TODO this needs to be persisted on the server
          if (permissions.hasCompletedForm) {
            //if the user has never added their details or permissions direct to the form
            console.log('redirect to main page');
          } else {
            require(['../layouts/settings-layout'], (SettingsLayout) => {
              var settingsLayout = new SettingsLayout({
                el: '[data-component="application"]',
              });
              settingsLayout.render();
            });
          }
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

  onRouteLogOut: function() {
    promiseDB.createDB(dbConfig)
      .then((db) => promiseDB.deleteDB(db))
      .then(() => this.navigate('', { trigger: true }))
      .catch((err) => {
        this.navigate(`/error/${err.message}`);
      });
  },

  onRouteError: function(err) {
    //TODO ADD ERROR STATE
    console.log('-----------------------');
    console.log(err);
    console.log('-----------------------');
  },

});
