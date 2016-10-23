/**
  @module ember-flexberry-gis
*/

import Ember from 'ember';

/**
  Mixin which injects map-tools methods & properties into leaflet map.

  @class LeafletMapToolsMixin
  @extends <a href="http://emberjs.com/api/classes/Ember.Mixin.html">Ember.Mixin</a>
*/
export default Ember.Mixin.create({
  /**
    Initializes leaflet map related properties.
  */
  willInitLeafletMap(leafletMap) {
    this._super(...arguments);

    leafletMap.flexberryMap.tools = {
      // Destroys flexberryMap.tools.
      _destroy: () => {
        // Remove flexberryMap.tools namespace & related methods & properties.
        delete leafletMap.flexberryMap.tools;
      }
    };
  },

  /**
    Destroys leaflet map related properties.
  */
  willDestroyLeafletMap(leafletMap) {
    this._super(...arguments);

    leafletMap.flexberryMap.tools._destroy();
  }
});
