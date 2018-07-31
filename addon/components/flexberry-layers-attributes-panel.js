/**
  @module ember-flexberry-gis
*/

import Ember from 'ember';
import layout from '../templates/components/flexberry-layers-attributes-panel';
import LeafletZoomToFeatureMixin from '../mixins/leaflet-zoom-to-feature';
import checkIntersect from '../utils/polygon-intersect-check';
import * as buffer from 'npm:@turf/buffer';
import * as thelpers from 'npm:@turf/helpers';
import * as difference from 'npm:@turf/difference';
import * as booleanEqual from 'npm:@turf/boolean-equal';
import * as lineSplit from 'npm:@turf/line-split';
import * as polygonToLine from 'npm:@turf/polygon-to-line';
import * as lineToPolygon from 'npm:@turf/line-to-polygon';
import * as booleanWithin from 'npm:@turf/boolean-within';
import * as kinks from 'npm:@turf/kinks';
import * as helper from 'npm:@turf/helpers';
import * as lineIntersect from 'npm:@turf/line-intersect';
import * as lineSlice from 'npm:@turf/line-slice';
import * as invariant from 'npm:@turf/invariant';
import * as distance from 'npm:@turf/distance';
import * as midpoint from 'npm:@turf/midpoint';
import * as union from 'npm:@turf/union';

/**
  The component for editing layers attributes.

  @class FlexberryLayersAttributesPanelComponent
  @uses LeafletZoomToFeatureMixin
  @extends <a href="http://emberjs.com/api/classes/Ember.Component.html">Ember.Component</a>
 */
export default Ember.Component.extend(
  LeafletZoomToFeatureMixin, {
  /**
    Reference to 'layers-styles-renderer' servie.

    @property layersStylesRenderer
    @type LayersStylesRendererService
  */
  layersStylesRenderer: Ember.inject.service('layers-styles-renderer'),

  /**
    Measure units for buffer tool.

    @property bufferUnits
    @type Object
  */
  bufferUnits: {
    meters: 'components.flexberry-layers-attributes-panel.buffer.units.meters',
    kilometers: 'components.flexberry-layers-attributes-panel.buffer.units.kilometers'
  },

  /**
    Selected mesure unit.

    @property _selectedUnit
    @type String
    @default undefined
    @private
  */
  _selectedUnit: undefined,

  /**
    Buffer radius.

    @property _radius
    @type Number
    @default 500
    @private
  */
  _radius: 500,

  /**
    Layer with buffer.

    @property _bufferLayer
    @type <a href="http://leaflet.github.io/Leaflet.Editable/doc/api.html">L.Layer</a>
    @default null
    @private
  */
  _bufferLayer: null,
  /**
    Leaflet.Editable drawing tools instance.

    @property _editTools
    @type <a href="http://leaflet.github.io/Leaflet.Editable/doc/api.html">L.Ediatble</a>
    @default null
    @private
  */
  _editTools: null,

  _activeTabs: {},

  /**
    Cache for tab models.

    @property _tabModelsCache
    @type Array
    @private
  */
  _tabModelsCache: Ember.A(),

  /**
    Computed property that builds tab models collection from items.

    @property _tabModels
    @type Object[]
    @private
    @readonly
  */
  _tabModels: Ember.computed('items.[]', 'i18n.locale', function () {
    let editedLayers = this.get('items');
    if (Ember.isPresent(editedLayers)) {
      if (editedLayers.length === 1) {
        this.set('_featureTabsOffset', 0);
        this.send('onTabMove', true);
      }

      return editedLayers.map((item) => {
        let name = Ember.get(item, 'name');

        let leafletObject = Ember.get(item, 'leafletObject');
        let readonly = Ember.get(item, 'settings.readonly') || false;
        let styleSettings = Ember.get(item, 'settings.styleSettings') || {};

        let getHeader = () => {
          let result = {};
          let locale = this.get('i18n.locale');
          let localizedProperties = Ember.get(item, `settings.localizedProperties.${locale}`) || {};
          let excludedProperties = Ember.get(item, `settings.excludedProperties`);
          excludedProperties = Ember.isArray(excludedProperties) ? Ember.A(excludedProperties) : Ember.A();

          for (let propertyName in Ember.get(leafletObject, 'readFormat.featureType.fields')) {
            if (excludedProperties.contains(propertyName)) {
              continue;
            }

            let propertyCaption = Ember.get(localizedProperties, propertyName);

            result[propertyName] = !Ember.isBlank(propertyCaption) ? propertyCaption : propertyName;
          }

          return result;
        };

        let availableDrawTools = null;
        if (!readonly) {
          availableDrawTools = this._getAvailableDrawTools(Ember.get(leafletObject, 'readFormat.featureType.geometryFields'));
        }

        let tabModel = Ember.Object.extend({
          _top: 5,
          _skip: 0,
          groupDraggable: false,
          _selectedRows: {},
          _editedRows: {},
          _selectedRowsCount: Ember.computed('_selectedRows', function () {
            let selectedRows = Ember.get(this, '_selectedRows');
            return Object.keys(selectedRows).filter((item) => Ember.get(selectedRows, item)).length;
          }),

          _typeSelectedRows: Ember.computed('_selectedRows', function() {
            let typeElements = {
              point: 0,
              line: 0,
              polygon: 0,
              multiLine: 0,
              multiPolygon: 0
            };
            let selectedRows = Ember.get(this, '_selectedRows');
            Object.keys(selectedRows).filter((item) => Ember.get(selectedRows, item))
            .map((key) => {
              let feature = this.get('featureLink')[key].feature;
              let layer = feature.leafletLayer.toGeoJSON();
              switch (layer.geometry.type) {
                case 'Point':
                  typeElements.point++;
                  break;
                case 'LineString':
                  typeElements.line++;
                  break;
                case 'MultiLineString':
                  typeElements.multiLine++;
                  break;
                case 'Polygon':
                  typeElements.polygon++;
                  break;
                case 'MultiPolygon':
                  typeElements.multiPolygon++;
                  break;
              }
            });
            return typeElements;
          }),

          _selectedRowsProperties: Ember.computed('_selectedRows', 'featureLink', function () {
            let selectedRows = Ember.get(this, '_selectedRows');
            let featureLink = Ember.get(this, 'featureLink');
            let result = Object.keys(selectedRows).filter((item) => Ember.get(selectedRows, item))
              .map((key) => {
                return featureLink[key].feature.properties;
              });

            return result.length > 0 ? result : Ember.get(this, 'properties');
          }),

          featureLink: null,
          propertyLink: null,
          properties: null,

          selectAll: false,

          // paging implementation
          propertiesToShow: Ember.computed('properties.[]', '_top', '_skip', function () {
            let properties = this.get('properties');
            let top = this.get('_top');
            let skip = this.get('_skip');
            return properties.slice(skip, skip + top);
          }),

          i18n: Ember.inject.service('i18n'),

          header: Ember.computed('i18n.locale', getHeader),

          _reload() {
            this.set('featureLink', {});
            this.set('propertyLink', {});
            let properties = Ember.A();

            leafletObject.eachLayer((layer) => {
              if (Ember.isNone(Ember.get(layer, 'feature'))) {
                Ember.set(layer, 'feature', {});
              }

              let props = Ember.get(layer, 'feature.properties');
              let propId = Ember.guidFor(props);
              if (Ember.isNone(Ember.get(layer, 'feature.leafletLayer'))) {
                Ember.set(layer.feature, 'leafletLayer', layer);
              }

              // the hash containing guid of properties object and link to feature layer
              this.set(`featureLink.${propId}`, layer);

              // the hash containing guid of properties object and link to that object
              this.set(`propertyLink.${propId}`, props);

              properties.pushObject(props);
            });

            this.set('properties', properties);
          },

          /**
            Mark layer as changed.

            @param {Object} e Event object.
          */
          _triggerChanged(e) {
            let [tabModel, layer, setEdited] = this;
            if (Ember.isEqual(Ember.guidFor(e.layer || e.target), Ember.guidFor(layer))) {
              Ember.set(tabModel, 'leafletObject._wasChanged', true);
              tabModel.notifyPropertyChange('leafletObject._wasChanged');

              if (setEdited) {
                tabModel.leafletObject.editLayer(layer);
              }
            }
          },

          init() {
            this.get('i18n.locale');
            this._reload();
          },

          willDestroy() {
            this.set('featureLink', null);
            this.set('propertyLink', null);
            this.set('properties', null);
          },

          /**
            Enable dragging for specified layers.

            @param {Array/String} layerIds Array of layers ids or single id.
          */
          enableGroupDragging(layerIds) {
            let ids = layerIds instanceof Array ? layerIds : Ember.A([layerIds]);
            let layers = ids.map((id) => this.get(`featureLink.${id}`));
            layers.forEach((layer) => {
              if (layer.dragEnabled()) {
                layer.addDragGroup(layers);
              } else {
                layer.enableDrag(layers);
              }

              layer.on('drag:dragend', this._triggerChanged, [this, layer, true]);
              if (layer.bringToFront) {
                layer.bringToFront();
              }
            });
          },

          /**
            Disable dragging for specified layers.

            @param {Array/String} layerIds Array of layers ids or single id.
          */
          disableGroupDragging(layerIds) {
            layerIds.forEach((id) => {
              let layer = this.get(`featureLink.${id}`);
              if (layer.editEnabled()) {
                layer.clearDragGroup();
              } else {
                layer.disableDrag();
                layer.off('drag:dragend', this._triggerChanged, [this, layer, true]);
              }
            });
          }
        });
        let cachedTab = this.get('_tabModelsCache').find((tab) => Ember.isEqual(tab.get('leafletObject'), leafletObject));
        if (!Ember.isNone(cachedTab)) {
          cachedTab.set('name', name);

          return cachedTab;
        }

        let newTab = tabModel.create(
          Ember.getOwner(this).ownerInjection(),
          {
            name,
            allowEdit: !readonly,
            leafletObject,
            availableDrawTools,
            styleSettings
          }
        );

        this.get('_tabModelsCache').addObject(newTab);

        return newTab;
      });
    }
  }),

  /**
    Offset of tab panel in pixels.

    @property _featureTabsOffset
    @type Number
    @default 0
    @private
    @readonly
  */
  _featureTabsOffset: 0,

  /**
    Flag indicates whether attributes edit dialog has been already requested by user or not.

    @property _editRowDialogHasBeenRequested
    @type Boolean
    @default false
    @private
  */
  _editRowDialogHasBeenRequested: false,

  /**
    Flag indicates whether to show edit row dialog.

    @property _onEditRowDialogIsVisible
    @type Boolean
    @default false
    @private
  */
  _onEditRowDialogIsVisible: false,

  /**
    Hash with edited row data.

    @property _editRowData
    @type Object
    @default null
    @private
  */
  _editRowData: null,

  /**
    Hash with edited row data copy.

    @property _editRowDataCopy
    @type Object
    @default null
    @private
  */
  _editRowDataCopy: null,

  /**
    Data for 'onDifferenceClick'.

    @property _dataForDifference
    @type Array
    @default null
    @private
  */
  _dataForDifference: null,

  /**
    Reference to component's template.
  */
  layout,

  /**
    Selected tab index.

    @property selectedTabIndex
    @type Number
    @default 0
  */
  selectedTabIndex: 0,

  /**
    Flag indicates that the panel is folded or not.

    @property folded
    @type Boolean
    @default false
  */
  folded: false,

  /**
    Flag indicates that the panel is loading or not.

    @property loading
    @type Boolean
    @default false
  */
  loading: false,

  /**
    Collection of tab items.

    @property items
    @type Object[]
    @default null
  */
  items: null,

  /**
    Integration with the layer tree

    @property settings
    @type Boolean
    @default null
  */
  settings: null,

  /**
    Available modes to add geometry.

    @property availableGeometryAddModes
    @type Array
    @default ['draw', 'manual', 'geoprovider']
  */
  availableGeometryAddModes: ['draw', 'manual', 'geoprovider', 'import'],

  /**
    Flag: indicates whether moveDialog has been requested

    @property _moveDialogHasBeenRequested
    @type boolean
    @default false
  */
  _moveDialogHasBeenRequested: false,

  /**
    Flag: indicates whether moveDialog is visible

    @property _moveDialogIsVisible
    @type boolean
    @default false
  */

  _moveDialogIsVisible: false,

  /**
    Flag: indicates that move was with error

    @property _moveWithError
    @type boolean
    @default false
  */
  _moveWithError: false,

  /*
    Flag indicates that union operation success.

    @property createCombinedPolygon
    @type Boolean
    @default false
  */
  createCombinedPolygon: false,

  /**
    Initializes component.
  */
  init() {
    this._super(...arguments);

    let settings = this.get('settings');
    if (Ember.isNone(settings)) {
      settings = {
        withToolbar: false,
        sidebarOpened: false,
      };

      this.set('settings', settings);

      this.set('_selectedUnit', 'meters');
    }
  },

  actions: {
    /**
      Handles click on a tab.

      @method actions.onTabSelect
      @param {Number} index Selected tab index.
    */
    onTabSelect(index) {
      if (index === this.get('selectedTabIndex')) {
        this.set('folded', !this.get('folded'));

        // While executing transition vertical scroll will always appear, it is unnecessary and looks very strange,
        // so we can hide scroll untill transition end.
        let $tabs = this.$('.bottompanel-tab-data-panel');
        $tabs.css('overflow', 'hidden');
        this.$('.ui.bottom.bottompanel').one('webkitTransitionEnd mozTransitionEnd oTransitionEnd otransitionend transitionend', () => {
          $tabs.css('overflow', 'auto');
        });
      } else {
        this.set('selectedTabIndex', index);
        if (this.get('folded')) {
          this.set('folded', false);
        }
      }
    },

    /**
      Handles click on tab close icon.

      @method actions.closeTab
      @param {Number} index closed tab index.
    */
    closeTab(index) {
      let tabModel = this.get(`_tabModels.${index}`);
      let editedRows = Ember.get(tabModel, '_editedRows');
      Object.keys(editedRows).filter((key) => editedRows[key]).forEach((key) => {
        let layer = tabModel.get(`featureLink.${key}`);
        layer.disableEdit();
        layer.disableDrag();
      });

      if (tabModel.get('groupDraggable')) {
        let selectedRows = Ember.get(tabModel, '_selectedRows');
        let currentRows = Object.keys(selectedRows).filter((key) => selectedRows[key]);
        tabModel.disableGroupDragging(currentRows);
      }

      let editedLayers = this.get('items');
      let selectedTabIndex = this.get('selectedTabIndex');
      this.get('_tabModelsCache').removeObject(tabModel);
      editedLayers.removeAt(index);
      if (selectedTabIndex >= index && selectedTabIndex - 1 >= 0) {
        this.set('selectedTabIndex', selectedTabIndex - 1);
      }
    },

    /**
      Handles click on tab.

      @method actions.onTabClick
      @param {String} tabModelName Tab's model name.
      @param {Object} e Event object.
    */
    onTabClick(tabModelName, e) {
      e = Ember.$.event.fix(e);
      let clickedTabName = Ember.$(e.currentTarget).attr('data-tab');

      Ember.set(this, `_activeTabs.${tabModelName}`, clickedTabName);
    },

    /**
      Handles attributes row selection.

      @method actions.onRowSelect
      @param {Object} tabModel Related tab.
      @param {String} rowId Selected row identifier.
      @param {Object} options Selection options.
    */
    onRowSelect(tabModel, rowId, options) {
      let selectedRows = Ember.get(tabModel, '_selectedRows');
      Ember.set(selectedRows, rowId, options.checked);
      Ember.set(tabModel, '_selectedRows', selectedRows);
      tabModel.notifyPropertyChange('_selectedRows');

      if (tabModel.get('groupDraggable')) {
        tabModel.set('groupDraggable', false);
        let selectedRows = Ember.get(tabModel, '_selectedRows');
        let currentRows = Object.keys(selectedRows).filter((key) => selectedRows[key]);
        currentRows.push(rowId);
        tabModel.disableGroupDragging(currentRows);
      }
    },

    /**
      Handles 'Find an item on the map' button click.

      @method actions.onFindItemClick
      @param {Object} tabModel Related tab.
    */
    onFindItemClick(tabModel) {
      let selectedRows = Ember.get(tabModel, '_selectedRows');
      let selectedFeatures = Object.keys(selectedRows).filter((item) => Ember.get(selectedRows, item))
        .map((key) => {
          return tabModel.featureLink[key].feature;
        });
      this.send('zoomTo', selectedFeatures);
    },

    /**
      Handles units dropdown clicks.

      @method actions.onUnitSelected
      @param {String} item Clicked item locale key.
      @param {String} key Clicked item value.
    */
    onUnitSelected(item, key) {
      this.set('_selectedUnit', key);
    },

    /**
      Handles 'Draw buffer' button click.

      @method actions.drawBuffer
      @param {Object} tabModel Related tab.
    */
    drawBuffer(tabModel) {
      let radius = this.get('_radius');
      let unit = this.get('_selectedUnit');
      let selectedRows = Ember.get(tabModel, '_selectedRows');
      let selectedFeatures = Object.keys(selectedRows).filter((item) => Ember.get(selectedRows, item))
        .map((key) => {
          return tabModel.featureLink[key].feature.leafletLayer.toGeoJSON();
        });

      let leafletMap = this.get('leafletMap');
      let featureCollection = thelpers.default.featureCollection(selectedFeatures);

      let buf = buffer.default(featureCollection, radius, { units: unit });
      let _bufferLayer = this.get('_bufferLayer');
      if (Ember.isNone(_bufferLayer)) {
        _bufferLayer = L.featureGroup();
        leafletMap.addLayer(_bufferLayer);
      }

      _bufferLayer.addLayer(L.geoJSON(buf));
      this.set('_bufferLayer', _bufferLayer);
    },

    /**
      Handles 'Delete buffer' button click.

      @method actions.deleteBuffer
    */
    deleteBuffer() {
      let _bufferLayer = this.get('_bufferLayer');
      _bufferLayer.clearLayers();
    },

    /**
      Handles 'Clear found items' button click.

      @method actions.onClearFoundItemClick
    */
    onClearFoundItemClick() {
      let serviceLayer = this.get('serviceLayer');
      serviceLayer.clearLayers();
    },

    /**
      Handles find intersecting polygons.

      @method actions.onFindIntersectPolygons
    */
    onFindIntersectPolygons(tabModel) {
      let selectedRows = Ember.get(tabModel, '_selectedRows');
      let selectedFeaturesKeys = Object.keys(selectedRows).filter((item) => Ember.get(selectedRows, item));
      let intersectPolygonFeatures = Ember.A();
      let intersectPolygonFeaturesKeys = Ember.A();
      selectedFeaturesKeys.forEach((item, index) => {
        let currentFeature = tabModel.featureLink[item].feature;
        let currentFeatureGeoJson = currentFeature.leafletLayer.toGeoJSON();
        let currentFeatureGeometry = currentFeatureGeoJson.geometry;
        let isIntersect = !Ember.isNone(currentFeatureGeometry) ? checkIntersect(currentFeatureGeometry) : false;

        if (isIntersect) {
          intersectPolygonFeaturesKeys.push(item);
          intersectPolygonFeatures.push(currentFeature);
        }
      });

      if (intersectPolygonFeatures.length !== 0) {
        Ember.set(tabModel, '_selectedRows', {});
        Ember.set(tabModel, 'selectAll', false);
        let selectedInterctItemsRows = Ember.get(tabModel, '_selectedRows');
        intersectPolygonFeaturesKeys.forEach((item, index) => {
          Ember.set(selectedInterctItemsRows, item, true);
        });
        Ember.set(tabModel, '_selectedRows', selectedInterctItemsRows);
        this.send('zoomTo', intersectPolygonFeatures);
      }
    },

    /**
      Handles 'Select all' checkbox click.

      @method actions.onSelectAllClick
      @param {Object} tabModel Related tab.
    */
    onSelectAllClick(tabModel) {
      this.changeSelectedAll(tabModel);
    },

    /**
      Handles 'getData' action from flexberry-table.

      @method actions.onTabGetData
      @param {Object} tabModel
      @param {Object} options
    */
    onTabGetData(tabModel, options) {
      Ember.set(tabModel, '_skip', options.skip);
      Ember.set(tabModel, '_top', options.top);
    },

    /**
      Handles tab panel moving.

      @method actions.onTabMove
      @param {Boolean} left Flag: indicates whether move direction is left or not.
    */
    onTabMove(left) {
      // move tabs bar on the left or on the right
      let offset = this.get('_featureTabsOffset');
      if (left) {
        if (offset > 0) {
          offset -= Math.min(25, offset);
        }
      } else {
        let panelWidth = Ember.$('.bottompanel-tab-nav-panel-tabs').innerWidth();
        let itemsWidth = 0;
        const navButtonWidth = 25;
        Ember.$('.bottompanel-tab-nav-panel-tabs').children().each((index, item) => {
          itemsWidth += Ember.$(item).outerWidth();
        });
        let offsetDelta = Math.min(25, (panelWidth >= itemsWidth ? 0 :
          (offset >= itemsWidth - panelWidth + navButtonWidth ? 0 :
            itemsWidth - panelWidth + navButtonWidth - offset)));
        offset += offsetDelta;
      }

      this.set('_featureTabsOffset', offset);
      Ember.$('.bottompanel-tab-nav-panel-tabs').css('left', `-${offset}px`);
    },

    /**
      Handles 'Delete selected items' button click.

      @method actions.onDeleteItemClick
      @param {Object} tabModel Related tab.
    */
    onDeleteItemClick(tabModel) {
      let selectedRows = Ember.get(tabModel, '_selectedRows');
      let editedRows = Ember.get(tabModel, '_editedRows');
      let editedRowsChange = false;
      let selectedFeatureKeys = Object.keys(selectedRows).filter((item) => Ember.get(selectedRows, item));
      selectedFeatureKeys.forEach((key) => {
        let layer = tabModel.featureLink[key];
        tabModel.leafletObject.removeLayer(layer);
        tabModel.properties.removeObject(tabModel.propertyLink[key]);
        delete selectedRows[key];
        delete tabModel.featureLink[key];
        delete tabModel.propertyLink[key];

        if (Ember.get(editedRows, key) || false) {
          delete editedRows[key];
          editedRowsChange = true;
          layer.disableEdit();
          layer.disableDrag();
          this.get('leafletMap').off('editable:editing', tabModel._triggerChanged, [tabModel, layer, true]);
          layer.off('drag:dragend', tabModel._triggerChanged, [tabModel, layer, true]);
        }

        tabModel._triggerChanged.call([tabModel, layer, false], { layer });
      });
      Ember.set(tabModel, '_selectedRows', selectedRows);
      tabModel.notifyPropertyChange('_selectedRows');
      if (editedRowsChange) {
        Ember.set(tabModel, '_editedRows', editedRows);
        tabModel.notifyPropertyChange('_editedRows');
      }
    },

    /**
      Performs row editing.

      @method actions.onRowEdit
      @param {Object} tabModel Related tab.
      @param {Object} rowId Editing row identifier.
    */
    onRowEdit(tabModel, rowId) {
      let editedProperty = tabModel.propertyLink[rowId];

      this.set('_editRowData', editedProperty);
      this.set('_editRowDataCopy', Ember.copy(editedProperty, false));
      this.set('_editRowTabModel', tabModel);
      this.set('_editRowLayer', tabModel.featureLink[rowId]);

      // Include dialog to markup.
      this.set('_editRowDialogHasBeenRequested', true);

      // Show dialog.
      this.set('_onEditRowDialogIsVisible', true);
    },

    /**
      Handles row edit dialog's 'approve' action.

      @method actions.onEditRowDialogApprove
      @param {Object} data Hash cantaining edited data.
    */
    onEditRowDialogApprove(data) {
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          var element = data[key];
          if (!Ember.isEqual(element, this.get(`_editRowData.${key}`))) {
            this.set(`_editRowData.${key}`, element);
            let tabModel = this.get('_editRowTabModel');
            let layer = this.get('_editRowLayer');
            tabModel._triggerChanged.call([tabModel, layer, true], { layer });
          }
        }
      }
    },

    /**
      Handles flexberry-table 'rowEdited' action.

      @param {Object} tabModel Related tab.
      @param {String} rowId Editing row identifier.
    */
    onTableRowEdited(tabModel, rowId) {
      let layer = tabModel.featureLink[rowId];
      tabModel._triggerChanged.call([tabModel, layer, true], { layer });
    },

    /**
      Handles row's geometry editing.

      @param {Object} tabModel Related tab.
      @param {String} rowId Editing row identifier.
    */
    onRowGeometryEdit(tabModel, rowId) {
      // Toggle row geometry editing
      let editedRows = Ember.get(tabModel, '_editedRows');
      let edit = Ember.get(editedRows, rowId) || false;
      edit = !edit;
      Ember.set(editedRows, rowId, edit);
      Ember.set(tabModel, '_editedRows', editedRows);
      tabModel.notifyPropertyChange('_editedRows');

      // Enable feature editing
      let layer = Ember.get(tabModel, `featureLink.${rowId}`);
      let leafletMap = this.get('leafletMap');

      let editTools = this._getEditTools();
      Ember.set(leafletMap, 'editTools', editTools);
      let isMarker = layer instanceof L.Marker || layer instanceof L.CircleMarker;

      if (edit) {
        // If the layer is not on the map - add it
        if (!leafletMap.hasLayer(layer)) {
          let addedLayers = Ember.get(tabModel, '_addedLayers') || {};
          addedLayers[Ember.guidFor(layer)] = layer;
          leafletMap.addLayer(layer);
          Ember.set(tabModel, '_addedLayers', addedLayers);
        }

        this._zoomToLayer(layer);
        if (!isMarker) {
          layer.enableEdit(leafletMap);
          leafletMap.on('editable:editing', tabModel._triggerChanged, [tabModel, layer, true]);
          let featureLink = Ember.get(tabModel, 'featureLink');
          let allLayers = Object.keys(featureLink).map((key) => featureLink[key]).filter((feature) => feature !== layer);
          layer.enableSnap(allLayers, { snapDistance: 20 });

          if (layer.bringToFront) {
            layer.bringToFront();
          }
        }

        layer.enableDrag();
        layer.on('drag:dragend', tabModel._triggerChanged, [tabModel, layer, true]);
      } else {
        if (!isMarker) {
          layer.disableEdit();
          layer.disableSnap();
          leafletMap.off('editable:editing', tabModel._triggerChanged, [tabModel, layer, true]);
        }

        layer.disableDrag();
        layer.off('drag:dragend', tabModel._triggerChanged, [tabModel, layer, true]);

        let addedLayers = Ember.get(tabModel, '_addedLayers') || {};
        if (!Ember.isNone(addedLayers[Ember.guidFor(layer)])) {
          leafletMap.removeLayer(layer);
          delete addedLayers[Ember.guidFor(layer)];
          Ember.set(tabModel, '_addedLayers', addedLayers);
        }
      }
    },

    /**
      Handles click on 'Save changes' button.

      @param {Object} tabModel Related tab model.
    */
    onSaveChangesClick(tabModel) {
      let leafletObject = tabModel.leafletObject;
      let saveFailed = (data) => {
        this.set('error', data);
        leafletObject.off('save:success', saveSuccess);
      };

      let saveSuccess = (data) => {
        Ember.set(tabModel, 'leafletObject._wasChanged', false);
        tabModel._reload();
        leafletObject.off('save:failed', saveFailed);
      };

      leafletObject.once('save:failed', saveFailed);
      leafletObject.once('save:success', saveSuccess);
      leafletObject.save();
    },

    /**
      Handles new row attributes dialog's 'approve' action.

      @param {Object} data A hash containing added feature properties.
    */
    onNewRowDialogApprove(data) {
      let tabModel = this.get('_newRowTabModel');
      let layer = this.get('_newRowLayer');

      if (this.get('createCombinedPolygon')) {
        this.send('onDeleteItemClick', tabModel);
        this.set('createCombinedPolygon', false);
        this.set('_newRowСhoiceValueMode', false);
        this.set('_newRowСhoiceValueData', null);
      }

      Ember.set(layer, 'feature', { type: 'Feature' });
      Ember.set(layer.feature, 'properties', data);
      Ember.set(layer.feature, 'leafletLayer', layer);
      if (typeof (layer.setStyle) === 'function') {
        layer.setStyle(Ember.get(tabModel, 'leafletObject.options.style'));
      }

      this.get('layersStylesRenderer').renderOnLeafletLayer({ leafletLayer: layer, styleSettings: tabModel.get('styleSettings') });

      tabModel.leafletObject.addLayer(layer);
      layer.disableEdit();

      let propId = Ember.guidFor(data);

      // the hash containing guid of properties object and link to feature layer
      Ember.set(tabModel, `featureLink.${propId}`, layer);

      // the hash containing guid of properties object and link to that object
      Ember.set(tabModel, `propertyLink.${propId}`, data);
      tabModel.properties.pushObject(data);

      tabModel._triggerChanged.call([tabModel, layer, false], { layer });

      if (this.get('_newRowPanToObject')) {
        this._zoomToLayer(layer);
        this.set('_newRowPanToObject', null);
      }
    },

    /**
      Handles new row attributes dialog's 'deny' action.
    */
    onNewRowDialogDeny() {
      if (this.get('createCombinedPolygon')) {
        this.set('createCombinedPolygon', false);
        this.set('_newRowСhoiceValueMode', false);
        this.set('_newRowСhoiceValueData', null);
      }

      let layer = this.get('_newRowLayer');
      this.get('leafletMap').removeLayer(layer);

      this.set('_newRowTabModel', null);
      this.set('_newRowLayer', null);
      this.set('_newRowPanToObject', null);
    },

    /**
      Handles new row attributes dialog's 'hide' action.
    */
    onNewRowDialogHide() {
      if (this.get('createCombinedPolygon')) {
        this.set('createCombinedPolygon', false);
        this.set('_newRowСhoiceValueMode', false);
        this.set('_newRowСhoiceValueData', null);
      }
    },

    /**
      Handles a new geometry adding completion.

      @param {Object} tabModel Related tab model.
      @param {Object} addedLayer Added layer.
    */
    onGeometryAddComplete(tabModel, addedLayer, options) {
      if (!Ember.isNone(options) && Ember.get(options, 'panToAddedObject')) {
        this.set('_newRowPanToObject', true);
      }

      this._showNewRowDialog(tabModel, addedLayer);
    },

    /**
      Handles a new geometry draw start.

      @param {Object} tabModel Related tab model.
      @param {Object} geometryType Type of geometry to be drawn.
    */
    onAddDrawStart(tabModel, geometryType) {
      if (geometryType === 'circle' || geometryType === 'rectangle') {
        return;
      }

      let featureLink = Ember.get(tabModel, 'featureLink');
      let allLayers = Object.keys(featureLink).map((key) => featureLink[key]);
      let leafletMap = this.get('leafletMap');
      let editTools = this._getEditTools();
      Ember.set(leafletMap, 'editTools', editTools);
      leafletMap.enableDrawSnap(allLayers, 20);
    },

    /**
      Handles a new geometry adding by import completion.

      @param {Object} tabModel Related tab model.
      @param {Object} addedLayer Added layer.
    */
    onImportComplete(tabModel, addedLayer) {
      this.set('_newRowTabModel', tabModel);
      this.set('_newRowLayer', addedLayer);
      this.send('onNewRowDialogApprove', Object.assign({}, addedLayer.feature.properties));
    },

    /**
      Handles click on 'Difference polygon' button.

      @param {Object} tabModel Related tab model.
    */
    onDifferenceClick(tabModel) {
      let selectedRows = Ember.get(tabModel, '_selectedRows');
      let selectedFeatures = Object.keys(selectedRows).filter((item) => Ember.get(selectedRows, item))
      .map((key) => {
        let feature = tabModel.featureLink[key].feature;
        let layer = feature.leafletLayer.toGeoJSON();
        if ((layer.geometry.type === 'Polygon') || (layer.geometry.type === 'MultiPolygon')) {
          return layer;
        }

        delete selectedRows[key];
      }).filter((item) => !Ember.isNone(item));

      if (selectedFeatures.length < 1) {
        return;
      }

      if (Ember.isNone(this.get('_dataForDifference'))) {
        this.set('_dataForDifference', selectedRows);
        this.changeSelectedAll(tabModel, false);

        // Create function for observer.
        let _this = this;
        tabModel._typeSelectedRowsObserverForDifference = function() {
          let typeSelectedRows = this.get('_typeSelectedRows');
          if (typeSelectedRows.polygon > 0 || typeSelectedRows.multiPolygon > 0) {
            _this.send('onDifferenceClick', tabModel);
          }
        };

        Ember.addObserver(tabModel, '_typeSelectedRows', null, tabModel._typeSelectedRowsObserverForDifference);
      } else {
        // Remove observer and function.
        Ember.removeObserver(tabModel, '_typeSelectedRows', null, tabModel._typeSelectedRowsObserverForDifference);
        tabModel._typeSelectedRowsObserverForDifference = undefined;

        // Find intersecting polygons with splitter.
        let dataForDifference = this.get('_dataForDifference');
        let intersectingPolygon = Object.keys(dataForDifference).filter((item) => Ember.get(dataForDifference, item))
        .map((key) => {
          let feature = tabModel.featureLink[key].feature;
          let layer = feature.leafletLayer.toGeoJSON();
          if (!booleanEqual.default(layer, selectedFeatures[0]) && lineIntersect.default(layer, selectedFeatures[0]).features.length > 0) {
            return layer;
          }

          delete dataForDifference[key];
        }).filter((item) => !Ember.isNone(item));

        intersectingPolygon.forEach((polygon) => {
          let differenceResult = difference.default(polygon, selectedFeatures[0]);

          if (polygon.geometry.type !== differenceResult.geometry.type) {
            invariant.default.getCoords(differenceResult).forEach((polygonCoords) => {
              let lefletLayer = L.geoJSON(helper.default.polygon(polygonCoords)).getLayers();
              this.set('_newRowTabModel', tabModel);
              this.set('_newRowLayer', lefletLayer[0]);
              this.send('onNewRowDialogApprove', Object.assign({}, polygon.properties));
            });
          } else {
            let lefletLayer = L.geoJSON(differenceResult).getLayers();
            this.set('_newRowTabModel', tabModel);
            this.set('_newRowLayer', lefletLayer[0]);
            this.send('onNewRowDialogApprove', Object.assign({}, polygon.properties));
          }
        });

        Ember.set(tabModel, '_selectedRows', dataForDifference);
        this.send('onDeleteItemClick', tabModel);

        this.set('_dataForDifference', null);
        this.changeSelectedAll(tabModel, false);
      }
    },

    /**
      Handles click on 'Split geometry' button.

      @param {Object} tabModel Related tab model.
    */
    onSplitGeometry(tabModel) {
      let editTools = this._getEditTools();
      this.get('leafletMap').fire('flexberry-map:switchToDefaultMapTool');
      editTools.on('editable:drawing:end', this._disableDrawSplitGeometry, [tabModel, this]);
      editTools.startPolyline();
    },

    /**
      Handles click on 'Union polygon' button.

      @method actions.doCombinedPolygon
      @param {Object} tabModel Related tab.
    */
    doCombinedPolygon(tabModel) {
      let selectedRows = Ember.get(tabModel, '_selectedRows');
      let selectedFeatures = Object.keys(selectedRows).filter((item) => Ember.get(selectedRows, item))
        .map((key) => {
          let feature = tabModel.featureLink[key].feature;
          let layer = feature.leafletLayer.toGeoJSON();
          if ((layer.geometry.type === 'Polygon') || (layer.geometry.type === 'MultiPolygon')) {
            return layer;
          }

          delete selectedRows[key];
        }).filter((item) => !Ember.isNone(item));

      if (selectedFeatures.length > 1) {
        let combinedPolygon = union.default(...selectedFeatures);
        let lefletLayers = L.geoJSON(combinedPolygon);
        let polygonLayers = lefletLayers.getLayers();

        let layerProperties = [];
        selectedFeatures.forEach((layer) => {
          layerProperties.push(Object.assign({}, layer.properties));
        });

        this.set('createCombinedPolygon', true);
        this.set('_newRowСhoiceValueMode', true);
        this.set('_newRowСhoiceValueData', layerProperties);
        this.send('onGeometryAddComplete', tabModel, polygonLayers[0]);
      }
    },

    /**
      Handles move layer's object.

      @param {Object} tabModel Related tab model.
    */
    onMoveSelect(modes, tabModel) {
      switch (modes) {
        case 'dragNdrop':
          this._dragAndDrop(tabModel);
          break;
        case 'offset':
          this._showMoveDialog(tabModel);
          break;
      }
    },

    /**
      Handles move dialog's 'approve' action.

      @param {Number} moveX A hash containing move by X.
      @param {Number} moveY A hash containing move by Y.
    */
    onMoveDialogApprove(moveX, moveY) {
      let indexTabModel = this.get('selectedTabIndex');
      let tabModel = this.get(`_tabModels.${indexTabModel}`);
      let selectedRows = Ember.get(tabModel, '_selectedRows');
      let _moveX = parseFloat(this.get('_moveX')) || 0;
      let _moveY = parseFloat(this.get('_moveY')) || 0;
      let selectedFeatures = Object.keys(selectedRows).filter((item) => Ember.get(selectedRows, item))
      .map((key) => {
        return tabModel.featureLink[key].feature;
      });
      let crs = tabModel.leafletObject.options.crs;
      this.send('onClearFoundItemClick');
      this.set('_moveWithError', false);
      selectedFeatures.forEach((feature) => {
        let coords = feature.leafletLayer._latlngs;
        if (Ember.isNone(coords)) {
          coords = feature.leafletLayer._latlng;
        }

        this.move(coords, _moveX, _moveY, crs);
        if (this.get('_moveWithError')) {
          this.move(coords, -_moveX, -_moveY, crs);
        }

        if (feature.leafletLayer.redraw) {
          feature.leafletLayer.redraw();
        }

        tabModel._triggerChanged.call([tabModel, feature.leafletLayer, true], { layer: feature.leafletLayer });
      });
    }
  },

  /**
    Selected or deselected all objects.

    @param {Object} tabModel Tab model.
    @param {Boolean} selectedFlag Indicates select or deselect objects.
  */
  changeSelectedAll(tabModel, selectedFlag) {
    let selectAll = Ember.get(tabModel, 'selectAll');
    if (!Ember.isNone(selectedFlag)) {
      Ember.set(tabModel, 'selectAll', selectedFlag);
      selectAll = selectedFlag;
    }

    if (!selectAll) {
      Ember.set(tabModel, '_selectedRows', {});
    } else {
      let selectedRows = Object.assign(...Object.keys(Ember.get(tabModel, 'propertyLink')).map(k => ({
        [k]: true
      })));
      Ember.set(tabModel, '_selectedRows', selectedRows);
    }

    tabModel.notifyPropertyChange('_selectedRows');
    if (tabModel.get('groupDraggable')) {
      tabModel.set('groupDraggable', false);
      let currentRows = Object.keys(tabModel.get('featureLink'));
      tabModel.disableGroupDragging(currentRows);
    }
  },

  /**
    Disables tool and split geometry.

    @param {Object} e Event object.
  */
  _disableDrawSplitGeometry(e) {
    let [tabModel, _this] = this;

    let selectedRows = Ember.get(tabModel, '_selectedRows');
    let selectedFeatures = Object.keys(selectedRows).filter((item) => Ember.get(selectedRows, item))
    .map((key) => {
      let feature = tabModel.featureLink[key].feature;
      let layer = feature.leafletLayer.toGeoJSON();
      if ((layer.geometry.type !== 'LineString') && (layer.geometry.type !== 'MultiLineString') &&
          (layer.geometry.type !== 'Polygon') && (layer.geometry.type !== 'MultiPolygon')) {
        delete selectedRows[key];
        return;
      }

      return layer;
    }).filter((item) => !Ember.isNone(item));

    let editTools = _this.get('_editTools');
    editTools.off('editable:drawing:end', _this._disableDrawSplitGeometry, _this);
    editTools.stopDrawing();

    // Delete split line from layer.
    let editLayer = _this.get('_editTools.editLayer');
    if (!Ember.isNone(editLayer)) {
      editLayer.clearLayers();
    }

    let featuresLayer = _this.get('_editTools.featuresLayer');
    if (!Ember.isNone(featuresLayer)) {
      featuresLayer.clearLayers();
    }

    let splitLine = e.layer.toGeoJSON();
    let kinksPoint = kinks.default(splitLine);
    if (kinksPoint.features.length !== 0) {
      _this.set('error', new Error('Splitting line has self-intersections'));
      return;
    }

    let newLayerCreate = false;
    selectedFeatures.forEach((layer) => {
      let split = helper.default.featureCollection([]);
      switch (layer.geometry.type) {
        case 'LineString':
          split = lineSplit.default(layer, splitLine);
          break;
        case 'MultiLineString': //TODO Need TEST!!!!!
          let arrayLineString = layer.geometry.coordinates;
          let resultLineString = [];
          arrayLineString.forEach((line) => {
            let lineSplitResult = lineSplit.default(helper.default.lineString(line), splitLine);
            resultLineString = resultLineString.concat(lineSplitResult.features);
          });

          split = helper.default.featureCollection(resultLineString);
          break;
        case 'Polygon':
          let resultSplit = _this._polygonSplit(layer, splitLine);
          if (resultSplit.length > 1) {
            split = helper.default.featureCollection(resultSplit);
          }

          break;
        case 'MultiPolygon':
          let arrayPolygons = layer.geometry.coordinates;
          let resultPolygonSplit = [];
          arrayPolygons.forEach((polygon) => {
            resultPolygonSplit = resultPolygonSplit.concat(_this._polygonSplit(helper.default.polygon(polygon), splitLine));
          });

          if (arrayPolygons.length < resultPolygonSplit.length) {
            split = helper.default.featureCollection(resultPolygonSplit);
          }

          break;
      }

      if (split.features.length === 0) {
        let selectedRows = Ember.get(tabModel, '_selectedRows');
        let key = Ember.guidFor(layer.properties);
        delete selectedRows[key];
      }

      split.features.forEach((splitResult) => {
        let lefletLayer = L.geoJSON(splitResult).getLayers();
        _this.set('_newRowTabModel', tabModel);
        _this.set('_newRowLayer', lefletLayer[0]);
        newLayerCreate = true;
        _this.send('onNewRowDialogApprove', Object.assign({}, layer.properties));
      });
    });

    if (newLayerCreate) {
      _this.send('onDeleteItemClick', tabModel);
    }
  },

  /**
    Split splitter and split polygon each part splitter.

    @param {Object} layer polygon.
    @param {Object} laysplitLineer splitter.
  */
  _polygonSplit(layer, splitLine) {
    let arraySplitLine = [];
    let i = 0;
    let waitEndPoint = false;
    let startPoint;

    // We divide line of the user.
    // If used lineSplit, resulting lines will not cross the polygon line, so we use while.
    while (i !== splitLine.geometry.coordinates.length) {
      let point = helper.default.point(splitLine.geometry.coordinates[i]);
      if (!booleanWithin.default(point, layer) && !waitEndPoint) {
        if (!Ember.isNone(startPoint) && lineIntersect.default(layer, lineSlice.default(startPoint, point, splitLine)).features.length > 0) {
          let resultlineIntersect = lineIntersect.default(layer, lineSlice.default(startPoint, point, splitLine));
          if (resultlineIntersect.features.length === 2) {
            arraySplitLine.push(lineSlice.default(startPoint, point, splitLine));
          } else {
            for (let j = 1; j < resultlineIntersect.features.length - 1; j = j + 2) {
              let intersectPointStart = resultlineIntersect.features[j];
              let intersectPointEnd = resultlineIntersect.features[j + 1];
              let intersectMidPoint = midpoint.default(intersectPointStart, intersectPointEnd);
              arraySplitLine.push(lineSlice.default(startPoint, intersectMidPoint, splitLine));
              startPoint = intersectMidPoint;
            }

            arraySplitLine.push(lineSlice.default(startPoint, point, splitLine));
          }
        }

        startPoint = point;
      } else if (booleanWithin.default(point, layer)) {
        waitEndPoint = true;
      } else if (waitEndPoint) {
        let resultlineIntersect = lineIntersect.default(layer, lineSlice.default(startPoint, point, splitLine));
        if (resultlineIntersect.features.length > 2) {
          for (let j = 1; j < resultlineIntersect.features.length - 1; j = j + 2) {
            let intersectPointStart = resultlineIntersect.features[j];
            let intersectPointEnd = resultlineIntersect.features[j + 1];
            let intersectMidPoint = midpoint.default(intersectPointStart, intersectPointEnd);
            arraySplitLine.push(lineSlice.default(startPoint, intersectMidPoint, splitLine));
            startPoint = intersectMidPoint;
          }
        }

        arraySplitLine.push(lineSlice.default(startPoint, point, splitLine));
        startPoint = point;
        waitEndPoint = false;
      }

      i++;
    }

    let arrayPolygon = [layer];
    arraySplitLine.forEach((line) => {
      let intersectingPolygon = arrayPolygon.filter((item) => lineIntersect.default(item, line).features.length > 1);
      intersectingPolygon.forEach((polygon) => {
        let arraySplitPolygon = this._lineSplitPolygon(polygon, line);
        let position = arrayPolygon.indexOf(polygon);
        arrayPolygon.splice(position, 1);
        arrayPolygon = arrayPolygon.concat(arraySplitPolygon);
      });
    });

    return arrayPolygon;
  },

  /**
    Split polygon.

    @param {Object} polygon polygon to split.
    @param {Object} line splitter.
  */
  _lineSplitPolygon(polygon, line) {
    let lineFromPolygon = polygonToLine.default(polygon);
    let startPolygonPoint = helper.default.point(lineFromPolygon.geometry.coordinates[0]);
    let splitByPoint = booleanWithin.default(startPolygonPoint, line);
    let arraySplitLine = lineSplit.default(lineFromPolygon, line);

    if (!splitByPoint) {
      let firstPartLine = invariant.default.getCoords(arraySplitLine.features[0]);
      let secondPartLine = invariant.default.getCoords(arraySplitLine.features[arraySplitLine.features.length - 1]);
      firstPartLine.shift();
      arraySplitLine.features.shift();
      arraySplitLine.features.pop();
      let combinePolygonLine = secondPartLine.concat(firstPartLine);
      arraySplitLine.features.push(helper.default.lineString(combinePolygonLine));
    }

    // Intersection points of the polygon and the line of division.
    let intersectingPoints = lineIntersect.default(line, lineFromPolygon);
    let polygonSide = lineSlice.default(intersectingPoints.features[0], intersectingPoints.features[1], line);
    let polygonSideCoords = invariant.default.getCoords(polygonSide);

    // Delete duplicates point.
    let uniqueValue = [];
    polygonSideCoords.forEach((polygonLine) => {
      if (!uniqueValue.includes(polygonLine)) {
        uniqueValue.push(polygonLine);
      }
    });

    // Because lineSlice not include intersection points. We replace start and end point.
    uniqueValue.splice(0, 1, invariant.default.getCoords(intersectingPoints.features[0]));
    uniqueValue.splice(uniqueValue.length - 1, 1, invariant.default.getCoords(intersectingPoints.features[1]));

    let polygons = [];
    arraySplitLine.features.forEach((polygonLine) => {

      // Add line points to polygon.
      let coordsSide = uniqueValue;
      let coordsPolygonLine = invariant.default.getCoords(polygonLine);
      let startPointPolygonLine = helper.default.point(coordsPolygonLine[0]);
      let endPointPolygonLine = helper.default.point(coordsPolygonLine[coordsPolygonLine.length - 1]);
      let pointSide = helper.default.point(coordsSide[0]);
      let distanceSideAndStartPoint = distance.default(startPointPolygonLine, pointSide);
      let distanceSideAndEndPoint = distance.default(endPointPolygonLine, pointSide);

      if (distanceSideAndEndPoint > distanceSideAndStartPoint) {
        coordsPolygonLine = coordsSide.reverse().concat(coordsPolygonLine);
      }

      if (distanceSideAndEndPoint < distanceSideAndStartPoint) {
        coordsPolygonLine = coordsPolygonLine.concat(coordsSide);
      }

      polygons.push(lineToPolygon.default(helper.default.lineString(coordsPolygonLine)));
    });

    return polygons;
  },

  /**
    Calculates new coordinates layer's feature after the move

    @param {Arrey} latlngs A hash containing  coordinates.
    @param {Number} x A hash containing move by X.
    @param {Number} y A hash containing move by Y.
    @param {Object} crs A hash containing layer's crs.
  */
  move(latlngs, x, y, crs) {
    if (Ember.isArray(latlngs)) {
      latlngs.forEach(ll => this.move(ll, x, y, crs));
    } else {
      let pointO = crs.unproject(L.point(0, 0));
      let pointOX = crs.unproject(L.point(x, 0));
      let pointOY = crs.unproject(L.point(0, y));
      latlngs.lat += (pointOY.lat - pointO.lat);
      latlngs.lng += (pointOX.lng - pointO.lng);

      if (latlngs.lat > 90 || latlngs.lat < -90 || latlngs.lng > 180 || latlngs.lng < -180) {
        this.set('_moveWithError', true);
      }
    }
  },

  /**
    Shows a dialog for entering the attributes  move of layer's feature.

    @param {Object} tabModel Related tab model.
  */
  _showMoveDialog() {
    // Include dialog to markup.
    this.set('_moveDialogHasBeenRequested', true);

    // Show dialog.
    this.set('_moveDialogIsVisible', true);
  },

  /**
    Drag and drop.

    @param {Object} tabModel Related tab model.
  */
  _dragAndDrop(tabModel) {
    this.send('onClearFoundItemClick');
    tabModel.toggleProperty('groupDraggable');
    let selectedRows = Ember.get(tabModel, '_selectedRows');
    let currentRows = Object.keys(selectedRows).filter((key) => selectedRows[key]);

    if (tabModel.get('groupDraggable')) {
      tabModel.enableGroupDragging(currentRows);
    } else {
      tabModel.disableGroupDragging(currentRows);
    }
  },

  /**
    Returns Leaflet.Editable instance.
  */
  _getEditTools() {
    let leafletMap = this.get('leafletMap');

    let editTools = this.get('_editTools');
    if (Ember.isNone(editTools)) {
      editTools = new L.Editable(leafletMap);
      this.set('_editTools', editTools);
    }

    return editTools;
  },

  /**
    Overrides {{#crosslink "LeafletZoomToFeatureMixin/_prepareLayer:method"}} to make a copy of passed layer
    and apply a style to the layer to make it more visible.

    @method _prepareLayer
    @param {Object} layer
    @return {<a href="http://leafletjs.com/reference-1.2.0.html#layer">L.Layer</a>} Prepared layer.
    @private
  */
  _prepareLayer(layer) {
    return L.geoJson(layer.toGeoJSON()).setStyle({
      color: 'salmon',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.3
    });
  },

  /**
    Shows a dialog for entering the attributes of the newly added layer.

    @param {Object} tabModel Related tab model.
    @param {Object} addedLayer Newly added layer.
  */
  _showNewRowDialog(tabModel, addedLayer) {
    if (Ember.isNone(addedLayer)) {
      return;
    }

    let fields = Ember.get(tabModel, 'leafletObject.readFormat.featureType.fields');
    let data = Object.keys(fields).reduce((result, item) => {
      result[item] = null;
      return result;
    }, {});
    this.set('_newRowTabModel', tabModel);
    this.set('_newRowLayer', addedLayer);
    this.set('_newRowData', data);

    // Include dialog to markup.
    this.set('_newRowDialogHasBeenRequested', true);

    // Show dialog.
    this.set('_newRowDialogIsVisible', true);
  },

  /**
    Returns the available drawing tools according to the type of layer geometry.

    @param {Object} geometryFields Hash with the layer geometry field names and their types.
  */
  _getAvailableDrawTools(geometryFields) {
    if (!Ember.isNone(geometryFields)) {
      let firstField = Object.keys(geometryFields)[0];
      switch (geometryFields[firstField]) {
        case 'PointPropertyType':
        case 'MultiPointPropertyType':
          return ['marker'];

        case 'LineStringPropertyType':
        case 'MultiLineStringPropertyType':
          return ['polyline'];

        case 'MultiSurfacePropertyType':
        case 'PolygonPropertyType':
        case 'MultiPolygonPropertyType':
          return ['rectangle', 'polygon'];
      }
    }

    return ['marker', 'circle', 'polyline', 'rectangle', 'polygon'];
  },

  /**
    Zooms map to the specified layer.

    @param {Object} layer
  */
  _zoomToLayer(layer) {
    this.send('zoomTo', [layer.feature]);
    this.send('onClearFoundItemClick');
  }
});