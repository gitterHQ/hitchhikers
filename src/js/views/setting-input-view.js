import styles                 from '../../css/components/settings-input.css';
import Marionette             from 'backbone.marionette';
import settginsInputTemplate  from '../../templates/settings/input.hbs';

export default Marionette.ItemView.extend({
  template: settginsInputTemplate,

  events: {
    'input [type=text]':      'onInputChange',
    'change [type=checkbox]': 'onCheckboxChange',
  },

  modelEvents: {
    'error':            'onModelError',
    'change:storedVal': 'render',
  },

  onInputChange: function(e) {
    console.log('change');
    this.model.set('value', e.target.value);
  },

  onCheckboxChange: function(e) {
    this.model.set('private', e.target.checked);
  },

  onModelError: function(model) {
    console.log('-----------------------');
    console.log('error', model.toJSON());
    console.log('-----------------------');
  },
});
