import styles            from '../../css/components/location-input.css';
import geocomplete       from 'geocomplete';
import SettingsInputView from './setting-input-view';

export default SettingsInputView.extend({
  onRender: function() {
    this.$el.find('[data-component="text-input"]').geocomplete({
      details: '[data-component="details"]'
    });
  },
});

