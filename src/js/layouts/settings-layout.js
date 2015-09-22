import styles            from '../../css/components/settings.css';
import Marionette        from 'backbone.marionette';
import settingsTemplate  from '../../templates/settings/layout.hbs';
import SettginsInputView from '../views/setting-input-view';
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

  onRender: function() {
    this.location.show(new SettginsInputView({
      model: locationModel,
    }));

    this.attendance.show(new SettginsInputView({
      model: attendanceModel,
    }));

    this.email.show(new SettginsInputView({
      model: emailModel,
    }));

  },

});
