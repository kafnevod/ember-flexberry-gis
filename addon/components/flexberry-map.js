/**
  @module ember-flexberry-gis
*/

import Ember from 'ember';
import LeafletOptionsMixin from '../mixins/leaflet-options';
import LeafletPropertiesMixin from '../mixins/leaflet-properties';
import LeafletEventsMixin from '../mixins/leaflet-events';
import LeafletMapInteractionMixin from '../mixins/leaflet-map/map-interaction';
import LeafletMapLoaderMixin from '../mixins/leaflet-map/map-loader';
import LeafletMapToolsMixin from '../mixins/leaflet-map/map-tools';

import layout from '../templates/components/flexberry-map';

/**
  Component's CSS-classes names.
  JSON-object containing string constants with CSS-classes names related to component's .hbs markup elements.

  @property {Object} flexberryClassNames
  @property {String} flexberryClassNames.prefix Component's CSS-class names prefix ('flexberry-map').
  @property {String} flexberryClassNames.wrapper Component's wrapping <div> CSS-class name ('flexberry-map').
  @readonly
  @static

  @for FlexberryMapComponent
*/
const flexberryClassNamesPrefix = 'flexberry-map';
const flexberryClassNames = {
  prefix: flexberryClassNamesPrefix,
  wrapper: flexberryClassNamesPrefix
};

/**
  Flexberry map component.
  Wraps [leaflet map](http://leafletjs.com/reference-1.0.0.html#map) into ember component.

  @class FlexberryMapComponent
  @extends <a href="http://emberjs.com/api/classes/Ember.Component.html">Ember.Component</a>
  @uses LeafletOptionsMixin
  @uses LeafletPropertiesMixin
  @uses LeafletEventsMixin
  @uses LeafletMapLoaderMixin
  @uses LeafletMapToolsMixin
 */
let FlexberryMapComponent = Ember.Component.extend(
  LeafletOptionsMixin,
  LeafletPropertiesMixin,
  LeafletEventsMixin,

  // Mixins containing leaflet map extensions (order is important).
  LeafletMapInteractionMixin,
  LeafletMapLoaderMixin,
  LeafletMapToolsMixin, {
    /**
      Leaflet map.

      @property _layer
      @type <a href="http://leafletjs.com/reference-1.0.0.html#map">L.Map</a>
      @default null
      @private
    */
    _layer: null,

    /**
      Reference to component's template.
    */
    layout,

    /**
      Reference to component's CSS-classes names.
      Must be also a component's instance property to be available from component's .hbs template.
    */
    flexberryClassNames,

    /**
      Component's wrapping <div> CSS-classes names.

      Any other CSS-class names can be added through component's 'class' property.
      ```handlebars
      {{#flexberry-map class="my-class"}}
        Map's content
      {{/flexberry-map}}
      ```

      @property classNames
      @type String[]
      @default ['flexberry-map']
    */
    classNames: ['flexberry-map'],

    /**
      List of leaflet map events which will be sended outside as component's actions.
    */
    leafletEvents: [
      'click', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mouseout',
      'mousemove', 'contextmenu', 'focus', 'blur', 'preclick', 'load',
      'unload', 'viewreset', 'movestart', 'move', 'moveend', 'dragstart',
      'drag', 'dragend', 'zoomstart', 'zoomend', 'zoomlevelschange',
      'resize', 'autopanstart', 'layeradd', 'layerremove',
      'baselayerchange', 'overlayadd', 'overlayremove', 'locationfound',
      'locationerror', 'popupopen', 'popupclose'
    ],

    /**
      List of leaflet map options which will be passed into leaflet map.
    */
    leafletOptions: [

      // Map state options.
      'center', 'zoom', 'minZoom', 'maxZoom', 'maxBounds', 'crs',

      // Interaction options.
      'dragging', 'touchZoom', 'scrollWheelZoom', 'doubleClickZoom', 'boxZoom',
      'tap', 'tapTolerance', 'trackResize', 'worldCopyJump', 'closePopupOnClick',
      'bounceAtZoomLimits',

      // Keyboard navigation options.
      'keyboard', 'keyboardPanOffset', 'keyboardZoomOffset',

      // Panning Inertia Options.
      'inertia', 'inertiaDeceleration', 'inertiaMaxSpeed', 'inertiaThreshold',

      // Control options.
      'zoomControl', 'attributionControl',

      // Animation options.
      'fadeAnimation', 'zoomAnimation', 'zoomAnimationThreshold', 'markerZoomAnimation'
    ],

    /**
      List of leaflet map properties bindings.
    */
    leafletProperties: ['zoom:setZoom', 'center:panTo:zoomPanOptions', 'maxBounds:setMaxBounds', 'bounds:fitBounds:fitBoundsOptions'],

    /**
      Map center latitude.

      @property lat
      @type Number
      @default null
    */
    lat: null,

    /**
      Map center longitude.

      @property lng
      @type Number
      @default null
    */
    lng: null,

    /**
      Map center.

      @property center
      @type <a href="http://leafletjs.com/reference-1.0.0.html#latlng">L.LatLng</a>
      @default [0, 0]
      @readOnly
    */
    center: Ember.computed('lat', 'lng', function () {
      return L.latLng(this.get('lat') || 0, this.get('lng') || 0);
    }),

    /**
      Map zoom.

      @property zoom
      @type Number
      @default null
    */
    zoom: null,

    /**
      Array of map layers.

      @property layers
      @type Array of NewPlatformFlexberryGISMapLayer
    */
    layers: null,

    /**
      Initializes DOM-related component's properties.
    */
    didInsertElement() {
      this._super(...arguments);

      // Initialize leaflet map.
      let leafletMap = L.map(this.$()[0], this.get('options'));
      this.willInitLeafletMap(leafletMap);
      this.initLeafletMap(leafletMap);
    },

    /**
      Destroys DOM-related component's properties.
    */
    willDestroyElement() {
      this._super(...arguments);

      let leafletMap = this.get('_layer');
      this.willDestroyLeafletMap(leafletMap);
      this.destroyLeafletMap(leafletMap);
    },

    /**
      Performs some initialization before leaflet map will be initialized.
    */
    willInitLeafletMap(leafletMap) {
      leafletMap.flexberryMap = {};
      window.leafletMap = leafletMap;

      this._super(...arguments);
    },

    /**
      Initializes leaflet map related properties.
    */
    initLeafletMap(leafletMap) {
      this._super(...arguments);

      this.set('_layer', leafletMap);

      this._addObservers();
      this._addEventListeners();

      this.sendAction('leafletInit', {
        map: leafletMap
      });
    },

    /**
      Performs some clean up before leaflet map will be destroyed.
    */
    willDestroyLeafletMap(leafletMap) {
      this._super(...arguments);

      delete leafletMap.flexberryMap;
      delete window.leafletMap;
    },

    /**
      Destroys leaflet map.
    */
    destroyLeafletMap(leafletMap) {
      this._super(...arguments);

      leafletMap.remove();
      this.set('_layer', null);

      this.sendAction('leafletDestroy');
    }

    /**
      Component's action invoking when [leaflet map](http://leafletjs.com/reference-1.0.0.html#map) initialized.

      @method sendingActions.leafletInit
      @param {Object} e Action's event object.
      @param {Boolean} e.map Initialized leaflet map.
    */

    /**
      Component's action invoking when [leaflet map](http://leafletjs.com/reference-1.0.0.html#map) destroyed.

      @method sendingActions.leafletDestroy
    */
  }
);

// Add component's CSS-class names as component's class static constants
// to make them available outside of the component instance.
FlexberryMapComponent.reopenClass({
  flexberryClassNames
});

export default FlexberryMapComponent;
