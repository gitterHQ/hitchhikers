import styles            from '../../css/components/settings.css';
import Marionette        from 'backbone.marionette';
import settingsTemplate  from '../../templates/settings/layout.hbs';
import SettingsInputView from '../views/setting-input-view';
import LocationInputView from '../views/location-input-view';
import { getUser, setUser } from '../services/user';

import {
  locationModel,
  attendanceModel,
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
    getUser()
      .then((user) => {
        user.hasCompletedForm = true;
        return setUser(user);
      })
      .then(() => {
        console.log('written user', this);
        this.trigger('form:submit');
      })
      .catch((err) => this.trigger('error', err));
  },

});
