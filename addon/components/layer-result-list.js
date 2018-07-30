/**
  @module ember-flexberry-gis
 */

import Ember from 'ember';
import layout from '../templates/components/layer-result-list';
import LeafletZoomToFeatureMixin from '../mixins/leaflet-zoom-to-feature';

// Url key used to identify transitions from ember-flexberry-gis on other resources.
const isMapLimitKey = 'GISLinked';

/**
  Component for display array of search\identify results

  @class LayerResultListComponent
  @uses LeafletZoomToFeatureMixin
  @extends <a href="http://emberjs.com/api/classes/Ember.Component.html">Ember.Component</a>
 */
export default Ember.Component.extend(LeafletZoomToFeatureMixin, {
  /**
    Reference to 'layers-styles-renderer' servie.

    @property layersStylesRenderer
    @type LayersStylesRendererService
  */
  layersStylesRenderer: Ember.inject.service('layers-styles-renderer'),

  /**
    Component's wrapping <div> CSS-classes names.

    Any other CSS-class names can be added through component's 'class' property.
    ```handlebars
    {{layer-result-list class="my-class"}}
    ```

    @property classNames
    @type String[]
    @default ['layer-result-list']
  */
  classNames: ['layer-result-list'],

  /**
    Reference to component's template.
  */
  layout,

  /**
    FeatureGroup to display layer from selectedFeature.

    @property serviceLayer
    @type L.FeatureGroup
    @default null
  */
  serviceLayer: null,

  /**
    Leaflet map object for zoom and pan.

    @property leafletMap
    @type L.Map
    @default null
  */
  leafletMap: null,

  /**
    Array of results for display, each result contains object with following properties
    layerModel - MapLayer model
    features - promise for array of GeoJSON features

    @property results
    @type Ember.A()
    @default null
  */
  results: null,

  /**
    Type of operation, whose results will be shown here.

    @property operationType
    @type String
    @default 'identify'
  */
  operationType: 'identify',

  /**
    Ready results for display without promise.

    @property _displayResults
    @type Ember.A()
    @default null
  */
  _displayResults: null,

  /**
    Flag: indicates when results contains no data.

    @property _noData
    @type boolean
    @default false
  */
  _noData: false,

  /**
    Flag: indicates when one or more results.features promises rejected.

    @property _hasError
    @type boolean
    @default false
  */
  _hasError: false,

  /**
    Current selected feature.

    @property _selectedFeature
    @type GeoJSON feature
    @default null
  */
  _selectedFeature: null,

  /**
    Flag: indicates whether to display links list (if present).

    @property _linksExpanded
    @type boolean
    @default false
   */
  _linksExpanded: false,

  /**
    Flag: indicates when confirm save dialog is canceled.

    @property _isCanceled
    @type boolean
    @default false
  */
  _isCanceled: true,

  actions: {
    /**
      Show\hide links list (if present).
      @method actions.toggleLinks
     */
    toggleLinks() {
      this.set('_linksExpanded', !this.get('_linksExpanded'));
    },

    /**
      Save changes in specified layer.

      @method actions.onSaveChanges
      @param {Object} layer Changed layer.
    */
    onSaveChanges(layer) {
      this._saveChanges(layer);
    },

    /**
      Handles edit properties button click.

      @method actions.editProperties
      @param {Object} layer Edited layer.
      @param {Object} feature Edited feature.
    */
    editProperties(layer, feature) {
      this.set('_editedLayer', layer);
      let layerModel = Ember.get(feature, 'layerModel');

      let getHeader = () => {
        let result = {};
        let locale = this.get('i18n.locale');
        let featuresPropertiesSettings = Ember.get(layerModel, 'settingsAsObject.displaySettings.featuresPropertiesSettings');
        let localizedProperties = Ember.get(featuresPropertiesSettings, `localizedProperties.${locale}`) || {};
        let excludedProperties = Ember.get(featuresPropertiesSettings, `excludedProperties`);
        excludedProperties = Ember.isArray(excludedProperties) ? Ember.A(excludedProperties) : Ember.A();

        for (let propertyName in Ember.get(layerModel, '_leafletObject.readFormat.featureType.fields')) {
          if (excludedProperties.contains(propertyName)) {
            continue;
          }

          let propertyCaption = Ember.get(localizedProperties, propertyName);

          result[propertyName] = !Ember.isBlank(propertyCaption) ? propertyCaption : propertyName;
        }

        return result;
      };

      this.set('_editDialogParams', {});
      this.set('_editDialogParams.fieldTypes', Ember.get(layerModel, '_leafletObject.readFormat.featureType.fieldTypes'));
      this.set('_editDialogParams.fields', Ember.get(layerModel, '_leafletObject.readFormat.featureType.fields'));
      this.set('_editDialogParams.fieldValidators', Ember.get(layerModel, '_leafletObject.readFormat.featureType.fieldValidators'));
      this.set('_editDialogParams.header', getHeader());
      this.set('_editDialogParams.editData', Ember.get(feature, 'properties'));
      this.set('_editDialogParams.feature', feature);

      this.set('_editDialogHasBeenRequested', true);
      this.set('_onEditDialogIsVisible', true);
    },

    /**
      Indicates that layer was changed.

      @method triggerChanged
      @param {Object} layer Changed layer.
      @param {Object} e Event object.
    */
    triggerChanged(layer, e) {
      Ember.set(layer, '_wasChanged', true);
      let leafletObject = Ember.get(layer || {}, 'layerModel._leafletObject');
      leafletObject.editLayer(e.layer || e.target);
    },

    /**
      Handles save dialog approve action.

      @method onSaveDialogApprove
    */
    onSaveDialogApprove() {
      this.set('_isCanceled', false);
      let displayResults = this.get('_displayResults');
      if (displayResults instanceof Array) {
        let promises = [];
        displayResults.forEach((result) => {
          promises.push(this._saveChanges(result));
        }, this);

        Ember.RSVP.allSettled(promises).finally(() => {
          let leafletMap = this.get('leafletMap');
          let identifyOptions = this.get('_identifyOptions') || {};
          if (identifyOptions.isClearing) {
            leafletMap.fire('flexberry-map:identify-clear-start', identifyOptions);
          } else {
            leafletMap.fire('flexberry-map:identify-start', identifyOptions);
          }
        });
      }
    },

    /**
      Handles save dialog deny action.

      @method onSaveDialogDeny
    */
    onSaveDialogDeny() {
      this.set('_isCanceled', false);
      this._undoChanges();
      let leafletMap = this.get('leafletMap');
      let identifyOptions = this.get('_identifyOptions') || {};
      if (identifyOptions.isClearing) {
        leafletMap.fire('flexberry-map:identify-clear-start', identifyOptions);
      } else {
        leafletMap.fire('flexberry-map:identify-start', identifyOptions);
      }
    },

    /**
      Handles save dialog hide action.

      @method onSaveDialogHide
    */
    onSaveDialogHide() {
      if (this.get('_isCanceled')) {
        let leafletMap = this.get('leafletMap');
        leafletMap.setLoaderContent('');
        leafletMap.hideLoader();
        let identifyLayer = this.get('_identifyOptions.polygonLayer');
        let identifyBufferedLayer = this.get('_identifyOptions.bufferedMainPolygonLayer');
        if (identifyLayer) {
          identifyLayer.disableEdit();
          identifyLayer.remove();
        }

        if (identifyBufferedLayer) {
          identifyLayer.disableEdit();
          identifyBufferedLayer.remove();
        }
      }

      this.set('_isCanceled', true);
    },

    /**
      Handles edit properties dialog approve.

      @method actions.onEditDialogApprove
      @param {Object} data Edited properties.
    */
    onEditDialogApprove(data) {
      let editedLayer = this.get('_editDialogParams.feature.leafletLayer');
      let changed = false;
      for (let i in data) {
        if (data.hasOwnProperty(i)) {
          if (Ember.get(editedLayer, `feature.properties.${i}`) !== data[i]) {
            Ember.set(editedLayer, `feature.properties.${i}`, data[i]);
            changed = true;
          }
        }
      }

      if (changed) {
        this.send('triggerChanged', this.get('_editedLayer'), { layer: editedLayer });
      }
    }
  },

  /**
    Observes leafletMap changes.

    @method _leafletMapObserver
    @private
  */
  _leafletMapObserver: Ember.on('init', Ember.observer('leafletMap', function() {
    let leafletMap = this.get('leafletMap');
    if (Ember.isNone(leafletMap) || this.get('operationType') !== 'select') {
      return;
    }

    leafletMap.off('flexberry-map:identify-clear-before', this._beforeClearIdentification, this);
    leafletMap.on('flexberry-map:identify-clear-before', this._beforeClearIdentification, this);

    leafletMap.off('flexberry-map:identify-before', this._beforeIdentification, this);
    leafletMap.on('flexberry-map:identify-before', this._beforeIdentification, this);
  })),

  /**
    Undoing changes to layer's objects.

    @method _undoChanges
    @private
  */
  _undoChanges() {
    let displayResults = this.get('_displayResults');
    if (!(displayResults instanceof Array)) {
      return;
    }

    let layerModels = displayResults.map((result) => Ember.get(result, 'layerModel'));
    layerModels.forEach((layerModel) => {
      let layer = layerModel.get('_leafletObject');
      if (layer.changes && Object.keys(layer.changes).length > 0) {
        let changedIds = [];
        Object.keys(layer.changes).forEach((key) => {
          let change = layer.changes[key];
          changedIds.push(change.feature.id);
          layer.removeLayer(change);
        });

        let layersStylesRenderer = this.get('layersStylesRenderer');
        if (changedIds.length > 0) {
          layer.once('load', function () {
            layer.changes = {};
            let styleSettings = JSON.parse(layerModel.get('settings')).styleSettings;
            layer.eachLayer((feature) => {
              if (changedIds.indexOf(feature.feature.id) > -1) {
                layersStylesRenderer.renderOnLeafletLayer({ leafletLayer: feature, styleSettings: styleSettings });
              }
            });
          });

          layer.loadFeatures(changedIds.map((id) => new L.Filter.GmlObjectID(id)));
        }
      }
    }, this);
  },

  /**
    Handles 'flexberry-map:identify-before' action.

    @method _beforeIdentification
    @param {Object} options Identification options.
    @private
  */
  _beforeIdentification(options) {
    let leafletMap = this.get('leafletMap');
    this.set('_identifyOptions', options);
    let displayResults = this.get('_displayResults');
    let hasChanges = false;
    if (displayResults instanceof Array) {
      let changed = displayResults.find((result) => result._wasChanged);
      hasChanges = !Ember.isNone(changed);
    }

    if (hasChanges) {
      this.set('_saveDialogHasBeenRequested', true);
      this.set('_saveDialogVisibility', true);
    } else {
      leafletMap.fire('flexberry-map:identify-start', options);
    }
  },

  /**
    Handles 'flexberry-map:identify-clear-before' action.

    @method _beforeClearIdentification
    @param {String} options Identify clear options.
    @private
  */
  _beforeClearIdentification(options) {
    let leafletMap = this.get('leafletMap');
    this.set('_identifyOptions', options);
    let displayResults = this.get('_displayResults');
    let hasChanges = false;
    if (displayResults instanceof Array) {
      let changed = displayResults.find((result) => result._wasChanged);
      hasChanges = !Ember.isNone(changed);
    }

    if (hasChanges) {
      this.set('_saveDialogHasBeenRequested', true);
      this.set('_saveDialogVisibility', true);
    } else {
      leafletMap.fire('flexberry-map:identify-clear-start', options);
    }
  },

  /**
    Saving changes for specified layer.

    @method _saveChanges
    @param {Object} layer Layer whose changes will be saved.
    @private
  */
  _saveChanges(layer) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      if (!layer._wasChanged) {
        resolve();
      }

      let leafletObject = Ember.get(layer || {}, 'layerModel._leafletObject');
      let saveFailed = (data) => {
        leafletObject.off('save:success', saveSuccess);
        reject(data);
      };

      let saveSuccess = (data) => {
        Ember.set(layer, '_wasChanged', false);
        layer.features.forEach((feature) => {
          Ember.set(feature, '_wasChanged', false);
        });

        leafletObject.off('save:failed', saveFailed);
        resolve(data);
      };

      leafletObject.once('save:failed', saveFailed);
      leafletObject.once('save:success', saveSuccess);
      leafletObject.save();
    });
  },

  /**
     Checks model layer links and adds list and edit forms to result object.

     @method _processLayerLinkForDisplayResults
     @param {Object} searchResults
     @param {Object} displayResult
     @private
   */
  _processLayerLinkForDisplayResults(searchResults, displayResult) {
    let links = Ember.get(searchResults, 'layerModel.layerLink');
    let layerLink = links.filter(link => link.get('allowShow') === true);

    layerLink.forEach((link) => {
      if (!Ember.isBlank(link)) {
        let mos = link.get('mapObjectSetting');
        if (!Ember.isBlank(mos)) {
          let editForm = mos.get('editForm');
          if (!Ember.isBlank(editForm)) {
            let linkParameters = link.get('parameters');

            linkParameters.forEach((param) => {
              if (!Ember.isBlank(param)) {
                let queryKey = param.get('queryKey');

                if (!Ember.isBlank(queryKey)) {
                  let listForm = mos.get('listForm');
                  if (!Ember.isBlank(listForm)) {
                    displayResult.listForms.pushObject({
                      url: listForm,
                      typeName: mos.get('typeName'),
                      queryKey: queryKey
                    });
                  }

                  let layerField = param.get('layerField');
                  if (!Ember.isBlank(layerField)) {
                    displayResult.editForms.pushObject({
                      url: editForm,
                      typeName: mos.get('typeName'),
                      queryKey: queryKey,
                      layerField: layerField
                    });
                  }
                }
              }
            });
          }
        }
      }
    });
  },

  /**
    Returns whether or not layer can be edited.

    @method _isLayerEditable
    @param {String} layerType Layer type.
  */
  _isLayerEditable(layerType) {
    if (this.get('operationType') === 'select') {
      return layerType === 'wfs' || layerType === 'wms-wfs';
    }

    return false;
  },

  /**
    Observer for passed results
    @method _resultObserver
  */
  _resultObserver: Ember.on('init', Ember.observer('results', function () {
    this.send('selectFeature', null);
    this.set('_hasError', false);
    this.set('_noData', false);
    this.set('_displayResults', null);

    let results = this.get('results') || Ember.A();

    // If results had been cleared.
    if (Ember.isBlank(results)) {
      return;
    }

    this.set('_showLoader', true);

    let displayResults = Ember.A();

    // Prepare results format for template.
    results.forEach((result) => {
      if (Ember.isBlank(result.features)) {
        return;
      }

      result.features.then(
        (features) => {
          if (features.length > 0) {
            let displayResult = {
              name: Ember.get(result, 'layerModel.name') || '',
              settings: Ember.get(result, 'layerModel.settingsAsObject.displaySettings.featuresPropertiesSettings'),
              displayProperties: Ember.get(result, 'layerModel.settingsAsObject.displaySettings.featuresPropertiesSettings.displayProperty'),
              listForms: Ember.A(),
              editForms: Ember.A(),
              features: Ember.A(features),
              layerModel: Ember.get(result, 'layerModel')
            };

            this._processLayerLinkForDisplayResults(result, displayResult);
            displayResults.pushObject(displayResult);
          }
        }
      );
    });

    let getFeatureDisplayProperty = (feature, featuresPropertiesSettings) => {
      let displayPropertyIsCallback = Ember.get(featuresPropertiesSettings, 'displayPropertyIsCallback') === true;
      let displayProperty = Ember.get(featuresPropertiesSettings, 'displayProperty');

      if (!Ember.isArray(displayProperty) && !displayPropertyIsCallback) {
        return '';
      }

      if (Ember.typeOf(displayProperty) !== 'string' && displayPropertyIsCallback) {
        return '';
      }

      if (!displayPropertyIsCallback) {
        let featureProperties = Ember.get(feature, 'properties') || {};

        let displayValue = Ember.none;
        displayProperty.forEach((prop) => {
          if (featureProperties.hasOwnProperty(prop)) {
            let value = featureProperties[prop];
            if (Ember.isNone(displayValue) && !Ember.isNone(value) && !Ember.isEmpty(value) && value.toString().toLowerCase() !== 'null') {
              displayValue = value;
            }
          }
        });

        return displayValue || '';
      }

      let calculateDisplayProperty = eval(`(${displayProperty})`);
      Ember.assert(
        'Property \'settings.displaySettings.featuresPropertiesSettings.displayProperty\' ' +
        'is not a valid javascript function',
        Ember.typeOf(calculateDisplayProperty) === 'function');

      return calculateDisplayProperty(feature);
    };

    let promises = results.map((result) => {
      return result.features;
    });

    Ember.RSVP.allSettled(promises).finally(() => {
      let order = 1;
      displayResults.forEach((result) => {
        result.order = order;
        result.first = result.order === 1;
        result.last = result.order === displayResults.length;
        order += 1;
        result.editable = this._isLayerEditable(Ember.get(result, 'layerModel.type'));

        result.features = result.features.sort((a, b) => {
          // If displayValue is empty, it should be on the bottom.
          if (Ember.isBlank(a.displayValue)) {
            return 1;
          }

          if (Ember.isBlank(b.displayValue)) {
            return -1;
          }

          if (a.displayValue > b.displayValue) {
            return 1;
          }

          if (a.displayValue < b.displayValue) {
            return -1;
          }

          return 0;
        });

        if (!Ember.isBlank(result.features)) {
          let ownLayerField;
          let objectList = Ember.A();

          let editForms = result.editForms;
          let listForms = result.listForms;

          result.features.forEach((feature) => {
            feature.displayValue = getFeatureDisplayProperty(feature, result.settings);
            feature.layerModel = Ember.get(result, 'layerModel');
            feature.editForms = Ember.A();

            if (editForms.length === 0) {
              return;
            }

            editForms.forEach((editForm) => {
              let url = editForm.url;
              let layerField = editForm.layerField;
              let queryKey = editForm.queryKey;
              let typeName = editForm.typeName;

              if (Ember.isBlank(url) || Ember.isBlank(layerField) || Ember.isBlank(queryKey)) {
                return;
              }

              let properties = feature.properties;
              let queryValue;

              if (Ember.isBlank(ownLayerField)) {
                for (var p in properties) {
                  if (properties.hasOwnProperty(p) && layerField.toLowerCase() === (p + '').toLowerCase()) {
                    ownLayerField = p;
                    break;
                  }
                }
              }

              if (!Ember.isBlank(ownLayerField)) {
                queryValue = properties[ownLayerField];
              }

              if (Ember.isBlank(queryValue)) {
                return;
              }

              let params = {};
              Ember.set(params, queryKey, queryValue);
              Ember.set(params, isMapLimitKey, true);

              feature.editForms.pushObject({
                url: url + L.Util.getParamString(params, url),
                typeName: typeName
              });

              objectList.pushObject(queryValue);
            });
          });

          let forms = Ember.A();
          if (objectList.length === 0 || listForms.length === 0) {
            return;
          }

          listForms.forEach((listForm) => {
            let params = {};

            Ember.set(params, isMapLimitKey, true);
            Ember.set(params, listForm.queryKey, objectList.join(','));

            forms.pushObject({
              url: listForm.url + L.Util.getParamString(params, listForm.url),
              typeName: listForm.typeName
            });
          });

          result.listForms = forms;
        }
      });

      this.set('_displayResults', displayResults);
      this.set('_noData', displayResults.length === 0);
      this.set('_showLoader', false);

      if (displayResults.length === 1) {
        this.send('zoomTo', displayResults.objectAt(0).features);
      }
    });
  }))
});
