import styles       from '../../css/components/map.css';
import Marionette   from 'backbone.marionette';
import mapTemplate  from '../../templates/map/view.hbs';

export default Marionette.ItemView.extend({
  id: 'map',

  template: mapTemplate,

  onRender: function() {
    var view = this;
    setTimeout(function() {
      var map = L.mapbox.map(view.el, 'lerouxb.nhefe79k', {
        zoomControl: false
      }).setView([40, 0], 2);

      map.touchZoom.disable();
      map.doubleClickZoom.disable();
      map.scrollWheelZoom.disable();
      if (map.tap) map.tap.disable();

      var opts = {
        pointToLayer: function(feature, latlon) {
          var icon = L.icon({
            iconUrl: 'https://avatars1.githubusercontent.com/' + feature.properties.title + '?s=16',
            className: 'round-pin',
            iconSize: [21, 21]
          });
          return L.marker(latlon, { icon: icon });
        }
      };

      var featureLayer = L.mapbox.featureLayer(null, opts)
        .loadURL('https://hitchhikers.gitter.im/users/geojson')
        .addTo(map);

      featureLayer.on('ready', function() {
        map.fitBounds(featureLayer.getBounds());
      });

      window.addEventListener('resize', function() {
        map.fitBounds(featureLayer.getBounds());
      });

    }, 0);

    return this;
  }

});
