/**
  @module ember-flexberry-gis
*/

import Ember from 'ember';

/**
  Mixin containing additional methods & properties for leaflet map.

  @class LeafletMapExtensionsMixin
  @extends <a href="http://emberjs.com/api/classes/Ember.Mixin.html">Ember.Mixin</a>
*/
export default Ember.Mixin.create({
  /**
    Injects additional methods into initialized leaflet map.

    @method _injectMapLoaderMethods
    @param {<a href="http://leafletjs.com/reference-1.0.0.html#map">L.Map</a>} leafletMap initialized leaflet map.
    @private
  */
  _injectMapLoaderMethods(leafletMap) {
    let $mapLoader = this.$(`.${this.get('flexberryClassNames').loader}`);

    // Sets map loader's content.
    leafletMap.setLoaderContent = (content) => {
      $mapLoader.text(content);
    };

    // Shows map loader.
    leafletMap.showLoader = () => {
      // Remember current handlers states & disable them,
      // to disable dragging, zoom, keyboard events handling, etc.
      leafletMap._handlers.forEach((handler) => {
        handler._beforeLoaderState = handler.enabled();

        if (handler._beforeLoaderState === true) {
          handler.disable();
        }
      });

      this.set('_isLoaderShown', true);
    };

    // Hides map loader.
    leafletMap.hideLoader = () => {
      this.set('_isLoaderShown', false);

      // Restore handlers states,
      // to restore dragging, zoom, keyboard events handling, etc.
      leafletMap._handlers.forEach((handler) => {
        if (handler._beforeLoaderState === true) {
          handler.enable();
        }
      });
    };

    // Prevents DOM events from being triggered while map loader is shown.
    // Call to L.DOMEvent.StopPropagation doesn't take an effect, so override map's '_fireDOMEvent' method.
    let originalFireDOMEvent = leafletMap._fireDOMEvent;
    leafletMap._fireDOMEvent = (...args) => {
      if (this.get('_isLoaderShown')) {
        return;
      }

      originalFireDOMEvent.apply(leafletMap, args);
    };
  },

  /**
    Removes injected additional methods from initialized leaflet map.

    @method _removeMapLoaderMethods
    @param {<a href="http://leafletjs.com/reference-1.0.0.html#map">L.Map</a>} leafletMap initialized leaflet map.
    @private
  */
  _removeMapLoaderMethods(leafletMap) {
    delete leafletMap.setLoaderContent;
    delete leafletMap.showLoader;
    delete leafletMap.hideLoader;
    delete leafletMap._fireDOMEvent;
  },

  /**
    Initializes leaflet map related properties.
  */
  willInitLeafletMap(leafletMap) {
    this._super(...arguments);

    this._injectMapLoaderMethods(leafletMap);
  },

  /**
    Destroys leaflet map related properties.
  */
  willDestroyLeafletMap(leafletMap) {
    this._super(...arguments);

    this._removeMapLoaderMethods(leafletMap);
  }
});
