/**
  @module ember-flexberry-gis
*/

import Ember from 'ember';

/**
  Component's CSS-classes names.
  JSON-object containing string constants with CSS-classes names related to component's .hbs markup elements.

  @property {String} flexberryClassNames.loaderDimmer Component's loader's dimmer CSS-class name ('flexberry-map-loader-dimmer').
  @property {String} flexberryClassNames.loader Component's loader CSS-class name ('flexberry-map-loader').
  @readonly
  @static

  @for FlexberryMapComponent
*/
const flexberryClassNamesPrefix = 'flexberry-map';
const flexberryClassNames = {
  loaderDimmer: flexberryClassNamesPrefix + '-loader-dimmer',
  loader: flexberryClassNamesPrefix + '-loader'
};

/**
  Mixin which injects loader's methods & properties into leaflet map.

  @class LeafletMapLoaderMixin
  @extends <a href="http://emberjs.com/api/classes/Ember.Mixin.html">Ember.Mixin</a>
*/
export default Ember.Mixin.create({
  /**
    Initializes leaflet map related properties.
  */
  willInitLeafletMap(leafletMap) {
    this._super(...arguments);

    // Flag: indicates whether loader is shown at the moment or not.
    let loaderIsShown = false;

    // Inject DOM-elements for loader & it's dimmer into map's container markup.
    let $mapContainer = this.$();
    let $dimmer = Ember.$('<div />')
      .addClass(flexberryClassNames.loaderDimmer)
      .addClass('ui dimmer')
      .appendTo($mapContainer);
    let $loader = Ember.$('<div />')
      .addClass(flexberryClassNames.loader)
      .addClass('ui text loader')
      .appendTo($mapContainer);

    // Reference to flexberryMap.interaction namespace.
    let mapInteraction = leafletMap.flexberryMap.interaction;

    // Define flexberryMap.loader namespace & related methods & properties.
    let loader = leafletMap.flexberryMap.loader = {
      // Loader's markup element.
      loaderElement: $loader,

      // Loader dimmer's markup element.
      dimmerElement: $dimmer,

      // Returns flag indicating whether loader is shown at the moment or not.
      isShown: () => {
        return loaderIsShown;
      },

      // Sets loader's content.
      setContent: (content) => {
        content = Ember.isNone(content) ? '' : content;
        content = Ember.typeOf(content) === 'string' ? content : '' + content;

        $loader.html(content);
      },

      // Shows loader.
      show: (options) => {
        // Set possibly defined loader's content.
        options = options || {};
        if (!Ember.isNone(options.content)) {
          loader.setContent(options.content);
        }

        if (loaderIsShown) {
          return;
        }

        // Disable map interaction.
        mapInteraction.disable();

        // Show loader & it's dimmer.
        $dimmer.addClass('active');
        $loader.addClass('active');

        loaderIsShown = true;
      },

      // Hides loader.
      hide: (options) => {
        // Set possibly defined loader's content.
        options = options || {};
        if (!Ember.isNone(options.content)) {
          loader.setContent(options.content);
        }

        if (!loaderIsShown) {
          return;
        }

        // Restore map interaction.
        mapInteraction.enable();

        // Hide loader & it's dimmer.
        $dimmer.removeClass('active');
        $loader.removeClass('active');

        loaderIsShown = false;
      },

      // Destroys flexberryMap.loader.
      _destroy: () => {
        // Remove DOM-markup related to map loader.
        $mapContainer.remove(`.${flexberryClassNames.loaderDimmer}`);
        $mapContainer.remove(`.${flexberryClassNames.loader}`);

        // Remove flexberryMap.loader namespace & related methods & properties.
        delete leafletMap.flexberryMap.loader;
      }
    };
  },

  /**
    Destroys leaflet map related properties.
  */
  willDestroyLeafletMap(leafletMap) {
    this._super(...arguments);

    leafletMap.flexberryMap.loader._destroy();
  }
});
