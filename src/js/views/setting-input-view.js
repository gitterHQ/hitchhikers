import styles                 from '../../css/components/settings-input.css';
import Marionette             from 'backbone.marionette';
import settginsInputTemplate  from '../../templates/settings/input.hbs';

export default Marionette.ItemView.extend({
  template: settginsInputTemplate,
});
