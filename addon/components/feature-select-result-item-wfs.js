/**
  @module ember-flexberry-gis
*/

import Ember from 'ember';
import layout from '../templates/components/feature-select-result-item-wfs';

/**
  Component for display GeoJSON feature object details from selecting results.

  @class FeatureResultItemComponent
  @extends <a href="http://emberjs.com/api/classes/Ember.Component.html">Ember.Component</a>
 */
export default Ember.Component.extend({

  /**
    Component's wrapping <div> CSS-classes names.

    Any other CSS-class names can be added through component's 'class' property.
    ```handlebars
    {{feature-select-result-item-wfs class="my-class"}}
    ```

    @property classNames
    @type String[]
    @default ['item', 'feature-result-item']
  */
  classNames: ['item', 'feature-result-item'],

  /**
    Components class names bindings.

    @property classNameBindings
    @type String[]
    @default ['isActive:active']
  */
  classNameBindings: ['isActive:active'],

  /**
    Flag: indicates whether to display detailed feature info.

    @property _infoExpanded
    @type boolean
    @default false
   */
  _infoExpanded: false,

  /**
    Flag: indicates whether to display links list (if present).

    @property _linksExpanded
    @type boolean
    @default false
   */
  _linksExpanded: false,

  /**
    Layer from map, binded to this feature.

    @property _bindedLayer
    @type Object
    @default undefined
    @private
  */
  _bindedLayer: undefined,

  /**
    Feature's map.

    @property leafletMap
    @type Object
    @readOnly
   */
  leafletMap: Ember.computed('_bindedLayer', function() {
    let layer = this.get('_bindedLayer') || {};
    return layer._map;
  }),

  /**
    Property to represent feature.

    @property displayProperty
    @type string
    @private
   */
  displayProperty: null,

  /**
    Feature properties excluded from being displayed in info table.

    @property _excludedProperties
    @type String[]
    @readOnly
    @private
   */
  _excludedProperties: Ember.computed('displaySettings', function () {
    return this.get('displaySettings.excludedProperties');
  }),

  /**
    Features localized properties to being displayed in info table.

    @property _localizedProperties
    @type Object
    @readOnly
    @private
  */
  _localizedProperties: Ember.computed('displaySettings', 'i18n.locale', function () {
    let currentLocale = this.get('i18n.locale');
    let localizedProperties = this.get(`displaySettings.localizedProperties.${currentLocale}`) || {};
    return localizedProperties;
  }),

  /**
    Flag: indicates whether to display detailed feature info.

    @property expanded
    @type boolean
    @readonly
   */
  expanded: Ember.computed('infoExpanded', '_infoExpanded', function () {
    return this.get('infoExpanded') || this.get('_infoExpanded');
  }),

  /**
    Flag: indicates whether component is active.

    @property isActive
    @type boolean
    @readonly
   */
  isActive: Ember.computed('selectedFeature', 'feature', function () {
    return this.get('selectedFeature') === this.get('feature');
  }),

  /**
    Reference to component's template.
  */
  layout,

  /**
   Settings for display feature info.

   @property displaySettings
   @type object
   @default null
  */
  displaySettings: null,

  /**
    Feature's metadata.

    @property feature
    @type GeoJSON feature object
  */
  feature: null,

  /**
    Current selected feature.

    @property feature
    @type GeoJSON feature object
  */
  selectedFeature: null,

  /**
    Returns Leaflet.Editable instance.
  */
  _getEditTools(leafletMap) {
    let editTools = this.get('_editTools');
    if (Ember.isNone(editTools)) {
      editTools = new L.Editable(leafletMap);
      this.set('_editTools', editTools);
    }

    return editTools;
  },

  /**
    Finds layer from map for current feature.

    @method _findBindedLayer
  */
  _findBindedLayer() {
    let bindedLayer = this.get('_bindedLayer');
    if (bindedLayer) {
      return bindedLayer;
    }

    let leafletObject = this.get('feature.layerModel._leafletObject') || {};
    let layersList = leafletObject.getLayers ? leafletObject.getLayers() : [];
    bindedLayer = layersList.find((layer) => Ember.get(layer, 'feature.id') === this.get('feature.id'));
    this.set('_bindedLayer', bindedLayer);

    return bindedLayer;
  },

  /**
    Indicates that feature was changed.

    @method _triggerChanged
    @param {Object} e Event object.
  */
  _triggerChanged(e) {
    this.set('feature._wasChanged', true);
    this.sendAction('triggerChanged', e);
  },

  actions: {

    /**
      Invokes {{#crossLink "FeatureResultItemComponent/sendingActions.selectFeature:method"}}'selectFeature' action{{/crossLink}}.
      @method actions.selectFeature
    */
    selectFeature() {
      this.sendAction('selectFeature', this.get('feature'));
    },

    /**
      Invokes {{#crossLink "FeatureResultItemComponent/sendingActions.panTo:method"}}'panTo' action{{/crossLink}}.
      @method actions.panTo
     */
    panTo() {
      this.sendAction('panTo', this.get('feature'));
    },

    /**
      Invokes {{#crossLink "FeatureResultItemComponent/sendingActions.zoomTo:method"}}'zoomTo' action{{/crossLink}}.
      @method actions.zoomTo
     */
    zoomTo() {
      this.sendAction('zoomTo', this.get('feature'));
    },

    /**
      Show\hide detailed feature info
      @method actions.showInfo
     */
    showInfo() {
      this.set('_infoExpanded', !this.get('_infoExpanded'));
      this.set('_linksExpanded', false);
    },

    /**
      Show\hide links list (if present).
      @method actions.toggleLinks
     */
    toggleLinks() {
      this.set('_linksExpanded', !this.get('_linksExpanded'));
    },

    /**
      Handles geometry editing.
      @method actions.geometryEdit
    */
    geometryEdit() {
      // Enable feature editing
      let layer = this._findBindedLayer();
      if (!layer) {
        return;
      }

      let leafletMap = Ember.get(layer, '_map');

      let editTools = this._getEditTools(leafletMap);
      Ember.set(leafletMap, 'editTools', editTools);

      if (!layer.editEnabled()) {
        leafletMap.fire('flexberry-map:switchToDefaultMapTool');
        // If the layer is not on the map - add it
        if (!leafletMap.hasLayer(layer)) {
          this.set('_isAdded', true);
          leafletMap.addLayer(layer);
        }

        this.sendAction('panTo', this.get('feature'));
        this.get('feature.leafletLayer').remove();

        this.set('_saveDragState', true);
        layer.enableDrag();
        if (!(layer instanceof L.Marker)) {
          layer.enableEdit(leafletMap);
          layer.on('editable:editing', this._triggerChanged, this);
          let leafletObject = this.get('feature.layerModel._leafletObject') || {};
          let layersList = leafletObject.getLayers ? leafletObject.getLayers() : [];
          layer.enableSnap(layersList.filter((feature) => feature !== layer), { snapDistance: 20 });
        }

        layer.on('drag:dragend', this._triggerChanged, this);
      } else {
        layer.disableEdit();
        layer.disableSnap();
        layer.disableDrag();
        layer.off('dragend', this._triggerChanged, this);
        layer.off('editable:editing', this._triggerChanged, this);

        if (this.get('_isAdded')) {
          leafletMap.removeLayer(layer);
        }
      }
    },
  },

  /**
    Destroys component.
  */
  willDestroy() {
    this._super(...arguments);

    let bindedLayer = this.get('_bindedLayer');
    if (bindedLayer) {
      bindedLayer.disableEdit();
      bindedLayer.off('editable:editing', this._triggerChanged, this);
      bindedLayer.off('mousedown', this._dragOnMouseDown, this);
      bindedLayer.disableSnap();
    }
  }

  /**
    Component's action invoking for select feature
    @method sendingActions.selectFeature
    @param {GeoJSON object} feature Feature for select
   */

  /**
    Component's action invoking for feature zooming
    @method sendingActions.zoomTo
    @param {GeoJSON object} feature Feature for select
   */

  /**
    Component's action invoking for feature pan
    @method sendingActions.panTo
    @param {GeoJSON object} feature Feature for select
   */

});
