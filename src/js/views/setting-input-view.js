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
    'error':        'onModelError',
    'change:value': 'onModelUpdateValue',
  },

  onInputChange: function(e) {
    this.model.set('value', e.target.value);
  },

  onCheckboxChange: function(e) {
    this.model.set('private', e.target.checked);
  },

  onModelUpdateValue: function() {
    var val = this.model.get('value');
    var name = this.model.get('name');
    var selector = `[name=${name}]`;
    var el = this.$el.find(selector);
    el.val(val);
  },

  onModelError: function(model) {
    console.log('-----------------------');
    console.log('error', model.toJSON());
    console.log('-----------------------');
  },
});
