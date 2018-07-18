/**
  @module ember-flexberry-gis
*/

import Ember from 'ember';
import layout from '../templates/components/flexberry-select-panel';
import {
  translationMacro as t
} from 'ember-i18n';

/**
  Component's CSS-classes names.
  JSON-object containing string constants with CSS-classes names related to component's .hbs markup elements.

  @property {Object} flexberryClassNames
  @property {String} flexberryClassNames.prefix Component's CSS-class names prefix ('flexberry-select-panel').
  @property {String} flexberryClassNames.wrapper Component's wrapping <div> CSS-class name ('flexberry-select-panel').
  @property {String} flexberryClassNames.layersOptions Component's layers-options menu CSS-class name ('flexberry-select-panel-layers-options').
  @property {String} flexberryClassNames.toolsOptions Component's tools-options menu CSS-class name ('flexberry-select-panel-tools-options').
  @property {String} flexberryClassNames.selectRectangle Component's select-rectangle mode's CSS-class name ('flexberry-select-panel-rectangle-tools-option').
  @property {String} flexberryClassNames.selectPolygon Component's select-polygon mode's CSS-class name ('flexberry-select-panel-polygon-tools-option').
  @property {String} flexberryClassNames.selectMarker Component's select-marker mode's CSS-class name ('flexberry-select-panel-marker-tools-option').
  @property {String} flexberryClassNames.selectPolyline Component's select-polyline mode's CSS-class name ('flexberry-select-panel-polyline-tools-option').
  @property {String} flexberryClassNames.otherOptions Component's options div CSS-class name ('flexberry-select-panel-options').
  @readonly
  @static

  @for FlexberrySelectPanelComponent
*/
const flexberryClassNamesPrefix = 'flexberry-select-panel';
const flexberryClassNames = {
  prefix: flexberryClassNamesPrefix,
  wrapper: flexberryClassNamesPrefix,
  layersOptions: flexberryClassNamesPrefix + '-layers-options',
  toolsOptions: flexberryClassNamesPrefix + '-tools-options',
  selectRectangle: flexberryClassNamesPrefix + '-rectangle-tools-option',
  selectPolygon: flexberryClassNamesPrefix + '-polygon-tools-option',
  selectMarker: flexberryClassNamesPrefix + '-marker-tools-option',
  selectPolyline: flexberryClassNamesPrefix + '-polyline-tools-option',
  otherOptions: flexberryClassNamesPrefix + '-options'
};

/**
  Flexberry select panel component.

  Usage:
  templates/my-map-form.hbs
  ```handlebars

  ```

  @class FlexberrySelectPanelComponent
  @extends <a href="http://emberjs.com/api/classes/Ember.Component.html">Ember.Component</a>
*/
let FlexberrySelectPanelComponent = Ember.Component.extend({
  /**
    Observes changes buffer parameters in flexberry-select-panel.

    @method _bufferObserver
    @type Observer
    @private
  */
  _bufferObserver: Ember.observer('bufferActive', '_selectedBufferUnits', 'bufferRadius', function () {
    let bufferActive = this.get('bufferActive');
    let selectedUnits = this.get('_selectedBufferUnits');
    let bufferRadius = this.get('bufferRadius');
    let bufferParameters = {
      active: bufferActive,
      units: selectedUnits,
      radius: bufferRadius
    };

    this.sendAction('onBufferSet', bufferParameters);
  }),

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
    Overridden ['tagName'](http://emberjs.com/api/classes/Ember.Component.html#property_tagName)
    to disable a component's wrapping element.

    @property tagName
    @type String
    @default ''
  */
  tagName: '',

  /**
    layers option's additional CSS-class.

    @property class
    @type String
    @default null
  */
  class: null,

  /**
    Tools option's 'rectangle' mode CSS-class.

    @property rectangleClass
    @type String
    @default null
  */
  rectangleClass: null,

  /**
    Tools option's 'rectangle' mode's caption.

    @property rectangleCaption
    @type String
    @default t('components.flexberry-select-panel.rectangle.caption')
  */
  rectangleCaption: t('components.flexberry-select-panel.rectangle.caption'),

  /**
    Tools option's 'rectangle' mode's icon CSS-class names.

    @property rectangleIconClass
    @type String
    @default 'square outline icon'
  */
  rectangleIconClass: 'square outline icon',

  /**
    Tools option's 'polygon' mode CSS-class.

    @property polygonClass
    @type String
    @default null
  */
  polygonClass: null,

  /**
    Tools option's 'polygon' mode's caption.

    @property polygonCaption
    @type String
    @default t('components.flexberry-select-panel.polygon.caption')
  */
  polygonCaption: t('components.flexberry-select-panel.polygon.caption'),

  /**
    Tools option's 'polygon' mode's icon CSS-class names.

    @property polygonIconClass
    @type String
    @default 'star icon'
  */
  polygonIconClass: 'star icon',

  /**
    Tools option's 'marker' mode CSS-class.

    @property markerClass
    @type String
    @default null
  */
  markerClass: null,

  /**
    Tools option's 'marker' mode's caption.

    @property markerCaption
    @type String
    @default t('components.flexberry-select-panel.marker.caption')
  */
  markerCaption: t('components.flexberry-select-panel.marker.caption'),

  /**
    Tools option's 'marker' mode's icon CSS-class names.

    @property markerIconClass
    @type String
    @default 'map marker icon'
  */
  markerIconClass: 'map marker icon',

  /**
    Tools option's 'polyline' mode CSS-class.

    @property polylineClass
    @type String
    @default null
  */
  polylineClass: null,

  /**
    Tools option's 'polyline' mode's caption.

    @property polylineCaption
    @type String
    @default t('components.flexberry-select-panel.polyline.caption')
  */
  polylineCaption: t('components.flexberry-select-panel.polyline.caption'),

  /**
    Tools option's 'polyline' mode's icon CSS-class names.

     @property polylineIconClass
     @type String
     @default 'minus icon'
  */
  polylineIconClass: 'minus icon',

  /**
    clear button's CSS-class.

    @property clearClass
    @type String
    @default null
  */
  clearClass: null,

  /**
    clear button's caption.

    @property clearCaption
    @type String
    @default t('components.flexberry-select-panel.clear.caption')
  */
  clearCaption: t('components.flexberry-select-panel.clear.caption'),

  /**
    clear button's icon CSS-class names.

    @property clearIconClass
    @type String
    @default 'remove icon'
  */
  clearIconClass: 'remove icon',

  /**
    Flag: is tools option 'rectangle' enable

    @property rectangle
    @default true
    @type Boolean
  */
  rectangle: true,

  /**
    Flag: is tools option 'polygon' enable

    @property polygon
    @default true
    @type Boolean
  */
  polygon: true,

  /**
    Flag: is tools option 'marker' enable

    @property marker
    @default true
    @type Boolean
  */
  marker: true,

  /**
    Flag: is tools option 'polyline' enable

    @property polyline
    @default true
    @type Boolean
  */
  polyline: true,

  /**
    Flag: is tools option 'buffer' enabled.

    @property polyline
    @default true
    @type Boolean
  */
  buffer: true,

  /**
    @property toolMode
    @default 'marker'
    @type {String}
   */
  toolMode: 'marker',

  /**
    Active buffer caption.

    @property bufferActiveCaption
    @type String
    @default t('components.flexberry-select-panel.buffer.active-caption')
  */
  bufferActiveCaption: t('components.flexberry-select-panel.buffer.active-caption'),

  /**
    Buffer radius caption.

    @property bufferRadiusCaption
    @type String
    @default t('components.flexberry-select-panel.buffer.radius-caption')
  */
  bufferRadiusCaption: t('components.flexberry-select-panel.buffer.radius-caption'),

  /**
    Flag indicates is buffer active

    @property bufferActive
    @type Boolean
    @default false
  */
  bufferActive: false,

  /**
    Buffer radius units

    @property _selectedBufferUnits
    @type String
    @default 'kilometers'
  */
  _selectedBufferUnits: 'kilometers',

  /**
    Buffer radius units with locale.

    @property bufferUnitsList
    @type Object
  */
  bufferUnitsList: {
    meters: 'components.flexberry-select-panel.buffer.units.meters',
    kilometers: 'components.flexberry-select-panel.buffer.units.kilometers'
  },

  /**
    Buffer radius in selected units

    @property bufferRadius
    @type Number
    @default 0
  */
  bufferRadius: 0,

  /**
    Leaflet map.

    @property leafletMap
    @type <a href="http://leafletjs.com/reference-1.0.0.html#map">L.Map</a>
    @default null
  */
  leafletMap: null,

  /**
    Observes changes in {{#crossLink "FlexberryMaptoolbarComponent/leafletMap:propery"}}'leafletMap' property{{/crossLink}}.
    Activates default map-tool when leafletMap initialized and subscribes on flexberry-map:identificationFinished event.

    @method _leafletMapDidChange
    @type Observer
    @private
  */
  _leafletMapDidChange: Ember.on('didInsertElement', Ember.observer('leafletMap', function () {

    let leafletMap = this.get('leafletMap');
    if (Ember.isNone(leafletMap)) {
      return;
    }

    // Attach custom event-handler.
    leafletMap.on('flexberry-map:selectFinished', this.selectFinished, this);
  })),

  actions: {
    /**
      Handles inner layer option button's 'click' action.

      @method actions.onLayerOptionChange
    */
    onLayerOptionChange(...args) {
      this.set('layerMode', args[0]);
      this._switch();

      this.sendAction('onLayerOptionChange', ...args);
    },

    /**
      Handles inner tool option button's 'click' action.

      @method actions.onToolOptionChange
    */
    onToolOptionChange(...args) {
      this.set('toolMode', args[0]);
      this._switch(true);

      this.sendAction('onToolOptionChange', ...args);
    },

    /**
      Handles buffer units dropdown value change.

      @method actions.onBufferUnitSelected
      @param {String} item Clicked item locale key.
      @param {String} key Clicked item value.
    */
    onBufferUnitSelected(item, key) {
      this.set('_selectedBufferUnits', key);
    },

    /**
      Handles inner clear button's 'click' action.

      @method actions.clear
    */
    clear(...args) {
      this.sendAction('clear', ...args);
    }
  },

  /**
      Handles 'flexberry-map:selectFinished' event of leaflet map.

      @method selectFinished
      @param {Object} e Event object.
      @param {Object} results Hash containing search results.
      @param {Object[]} results.features Array containing (GeoJSON feature-objects)[http://geojson.org/geojson-spec.html#feature-objects]
      or a promise returning such array.
    */
  selectFinished(e) {
    this.sendAction('onSelectFinished', e);
  },

  /**
    Initializes DOM-related component's properties.
  */
  didInsertElement() {
    this._super(...arguments);
    let selectedToolOption = this.get('toolMode');

    this._switchActiveTool(selectedToolOption);
  },

  /**
   * @method _switchActiveTool
   * @param {String} selectedToolOption
   */
  _switchActiveTool(selectedToolOption) {
    this.set('rectangleClass', null);
    this.set('polygonClass', null);
    this.set('markerClass', null);
    this.set('polylineClass', null);

    this.set(selectedToolOption + 'Class', 'active');
  },

  /**
   * @method _switch
   * handles changes in layer and tools options and fires 'flexberry-map:identificationOptionChanged' event
   * @private
   */
  _switch(_switchActiveTool) {
    let tool = this.get('toolMode');

    if (_switchActiveTool) {
      this._switchActiveTool(tool);
    }

    let leafletMap = this.get('leafletMap');
    if (Ember.isNone(leafletMap)) {
      return;
    }

    let mapToolName = 'identify-' + tool;
    leafletMap.fire('flexberry-map:identificationOptionChanged', {
      mapToolName
    });
  },

  /**
    Component's action invoking when layer option changed.

    @method sendingActions.onLayerOptionChange
    {{#crossLink "FlexberrySelectPanelComponent/sendingActions.onLayerOptionChange:method"}}select panel's on layer option changed action{{/crossLink}}.
  */

  /**
    Component's action invoking when tool option changed.

    @method sendingActions.onToolOptionChange
    {{#crossLink "FlexberrySelectPanelComponent/sendingActions.onToolOptionChange:method"}}select panel's on tool option changed action{{/crossLink}}.
  */

  /**
    Component's action invoking when map-tool must be activated.

    @method sendingActions.clear
    {{#crossLink "FlexberrySelectPanelComponent/sendingActions.clear:method"}}select panel's on clear button clicked action{{/crossLink}}.
  */
});

// Add component's CSS-class names as component's class static constants
// to make them available outside of the component instance.
FlexberrySelectPanelComponent.reopenClass({
  flexberryClassNames
});

export default FlexberrySelectPanelComponent;
