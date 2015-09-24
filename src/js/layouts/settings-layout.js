import styles            from '../../css/components/settings.css';
import Marionette        from 'backbone.marionette';
import settingsTemplate  from '../../templates/settings/layout.hbs';
import SettingsInputView from '../views/setting-input-view';
import LocationInputView from '../views/location-input-view';
import {
  locationModel,
  attendanceModel,
  emailModel
} from '../collections/user-preferences.js';


export default Marionette.LayoutView.extend({
  template: settingsTemplate,

  regions:      {
    location:   '[data-component="user-location-input"]',
    attendance: '[data-component="user-attendance-input"]',
    email:      '[data-component="user-email-input"]',
  },

  events: {
    'submit': 'onFormSubmit',
  },

  onRender: function() {
    this.location.show(new LocationInputView({
      model: locationModel,
    }));

    this.attendance.show(new SettingsInputView({
      model: attendanceModel,
    }));

    this.email.show(new SettingsInputView({
      model: emailModel,
    }));

  },

  onFormSubmit: function(e) {
    e.preventDefault();
    console.log('submit', e);
  },

});
