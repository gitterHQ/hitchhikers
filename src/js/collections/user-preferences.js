import Backbone from 'backbone';

//Location
export var locationModel = new Backbone.Model({
  name:    'location',
  private: false,
  value:   'Great Britan',
  type:    'text',
  icon:    'globe',
});

export var attendanceModel = new Backbone.Model({
  name:    'attendance',
  private: true,
  value:   'Public Attendance',
  type:    'text',
  icon:    'eye',
});

export var emailModel = new Backbone.Model({
  name:    'email',
  private: true,
  value:   'Email',
  type:    'email',
  icon:    'mail',
});

//Collection
var SettingsCollection = Backbone.Collection.extend({

});

export var settingsCollection = new SettingsCollection([
  locationModel,
  attendanceModel,
  emailModel
]);
