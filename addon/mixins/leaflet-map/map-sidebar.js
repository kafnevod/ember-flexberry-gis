/**
  @module ember-flexberry-gis
*/

import Ember from 'ember';

/**
  Mixin which injects map-commands methods & properties into leaflet map.

  @class LeafletMapCommandsMixin
  @extends <a href="http://emberjs.com/api/classes/Ember.Mixin.html">Ember.Mixin</a>
*/
export default Ember.Mixin.create({
  /**
    Performs some initialization before leaflet map will be initialized.

    @param {Object} leafletMap Leaflet map.
  */
  willInitLeafletMap(leafletMap) {
    this._super(...arguments);

    // Define flexberryMap.commands namespace & related methods & properties.
    let sidebar = leafletMap.flexberryMap.sidebar = {

      // Hide sidebar.
      hide() {
        let $control = Ember.$('.sidebar-wrapper');
        if ($control.length === 1 && !$control.hasClass('hidden')) {
          $control.addClass('hidden');
        }
      },

      // Show sidebar.
      show() {
        let $control = Ember.$('.sidebar-wrapper');
        if ($control.length === 1 && $control.hasClass('hidden')) {
          $control.removeClass('hidden');
        }
      }
    };
  },

  /**
    Performs some clean up before leaflet map will be destroyed.

    @param {Object} leafletMap Leaflet map.
  */
  willDestroyLeafletMap(leafletMap) {
    this._super(...arguments);
  }
});
