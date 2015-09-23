import Backbone from 'backbone';

//Location
export var locationModel = new Backbone.Model({
  name:        'location',
  private:     false,
  placeholder: 'Location',
  type:        'text',
  icon:        'globe',
  value:       '',
});

export var attendanceModel = new Backbone.Model({
  name:        'attendance',
  private:     true,
  placeholder: 'Public Attendance',
  type:        'text',
  icon:        'eye',
  disabled:    true,
});

export var emailModel = new Backbone.Model({
  name:        'email',
  private:     true,
  placeholder: 'Email',
  type:        'email',
  icon:        'mail',
  value:       '',
});

//Collection
var SettingsCollection = Backbone.Collection.extend({

});

export var settingsCollection = new SettingsCollection([
  locationModel,
  attendanceModel,
  emailModel,
]);
