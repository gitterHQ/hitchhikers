import url                      from 'url';
import querystring              from 'querystring';
import Backbone                 from 'backbone';
import promiseDB                from 'promise-db';
import clientSecretService      from '../services/client-secret';
import githubAccessTokenService from '../services/github-access-token';
import { getPermissions }       from '../services/user-permissions';
import dbConfig                 from '../../../config/indexed';
import { getUser, getUserFromAPI }              from '../services/user';

export default Backbone.Router.extend({

  routes: {
    '':                 'onIndexRoute',
    'login':            'onRouteLoggedIn',
    'log-out':          'onRouteLogOut',
    'settings':         'onRouteSettings',
    'loading':          'onRouteLoading',
    'error/:errorType': 'onRouteError',
  },

  //Index page
  onIndexRoute: function() {
    getUser()
      .then((user) => {
        //if we already have an access key don't show the index page
        //as the user is already logged in
        if (user) {
          //TODO this needs to be persisted on the server
          if (user.hasCompletedForm) {
            //if the user has never added their details or permissions direct to the form
            console.log('redirect to main page');
          } else {
            this.onRouteSettings();
          }
        }

        //If we are not logged in show the home page
        else {

          //close and hide the menu view
          if (this.menuTriggerView) {
            this.menuTriggerView.close();
            this.menuTriggerView.hide();
          }

          require(['../layouts/index-layout'], (IndexLayout) => {
            var indexLayout = new IndexLayout({
              el: '[data-component=application]',
            });

            this.listenTo(indexLayout, 'login:clicked', () => {
              this.stopListening(indexLayout, 'login:clicked');
              this.navigate('loading', { trigger: true });
            });

            indexLayout.render();
          });
        }
      });
  },

  //Post login view
  onRouteLoggedIn: function() {
    getUserFromAPI()
      .then((user) => this.navigate('', { trigger: true }))
      .catch((err) => this.navigate(`/error/${err.message}`));
  },

  onRouteLogOut: function() {
    promiseDB.createDB(dbConfig)
      .then((db) => promiseDB.deleteDB(db))
      .then(() => this.navigate('', { trigger: true }))
      .catch((err) => {
        this.navigate(`/error/${err.message}`);
      });
  },

  onRouteSettings: function() {
    require([
        '../layouts/settings-layout',
        '../views/menu-trigger.js',
        '../views/menu-view',
    ], (SettingsLayout, MenuTriggerView, MenuView) => {

      //settings layout
      var settingsLayout = new SettingsLayout({
        el: '[data-component="application"]',
      });
      settingsLayout.render();

      //If we don't already have a menu trigger view make one
      if (!this.menuTriggerView) {
        this.menuTriggerView = new MenuTriggerView({
          el: '[data-component="menu-trigger"]',
        });
        this.menuTriggerView.render();
      } else {
        this.menuTriggerView.close();
      }

      //if we don't already have a menu view make one
      if (!this.menuView) {
        this.menuView = new MenuView({
          el: '[data-component="user-menu"]',
        });
      }

    });
  },

  onRouteLoading: function() {
    require(['../views/loading-view.js'], (LoadingView) => {
      var loadingView = new LoadingView({
        el: '[data-component=application]',
      });
      loadingView.render();
    });
  },

  onRouteError: function(err) {
    //TODO ADD ERROR STATE
    console.log('-----------------------');
    console.log(err);
    console.log('-----------------------');
  },

});
