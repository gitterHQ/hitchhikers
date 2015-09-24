import styles            from '../../css/components/settings.css';
import $                 from 'jquery';
import _                 from 'lodash';
import Marionette        from 'backbone.marionette';
import settingsTemplate  from '../../templates/settings/layout.hbs';
import SettingsInputView from '../views/setting-input-view';
import LocationInputView from '../views/location-input-view';

import { getUser, setUserOnAPI } from '../services/user';

import {
  locationModel,
  emailModel
} from '../collections/user-preferences.js';

export default Marionette.LayoutView.extend({
  template: settingsTemplate,

  regions:      {
    location:   '[data-component="user-location-input"]',
    email:      '[data-component="user-email-input"]',
  },

  events: {
    'submit': 'onFormSubmit',
  },

  initialize: function (){
    getUser().then((user) => {
      if (user.email) emailModel.set('value', user.email);
      if (user.displayVal) locationModel.set('value', user.displayVal);
    });
  },

  onRender: function() {
    this.location.show(new LocationInputView({
      model: locationModel,
    }));

    this.email.show(new SettingsInputView({
      model: emailModel,
    }));

  },

  onFormSubmit: function(e) {
    e.preventDefault();

    //TODO submit and validate data

    var results = {
      lat:        $('[name=lat]').val(),
      lon:        $('[name=lng]').val(),
      code:       $('[name=country_short]').val(),
      city:       $('[name=locality]').val(),
      country:    $('[name=country]').val(),
      displayVal: $('[name=location]').val(),
      email:      $('[name=email]').val(),
    };

    getUser()
      .then((user) => {

        //format some data
        var data = _.extend({}, user, results, {
          hasCompletedForm: true,
        });
        delete data.id;

        //post it to the user
        return setUserOnAPI(data);
      })
      .then(() => {
        this.trigger('form:submit');
      })
      .catch((err) => {
        console.log('-----------------------');
        console.log(err);
        console.log('-----------------------');
      });
  },

});
