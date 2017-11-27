/**
  @module ember-flexberry-gis
*/

import Ember from 'ember';
import layout from '../../templates/components/layers-styles/graduated';

/**
  Component containing GUI for 'graduated' layers-style

  @class GraduatedLayersStyleComponent
  @extends <a href="http://emberjs.com/api/classes/Ember.Component.html">Ember.Component</a>
*/
export default Ember.Component.extend({
  /**
    Reference to 'layers-styles-renderer' service.

    @property _layersStylesRenderer
    @type LayersStylesRendererService
    @private
  */
  _layersStylesRenderer: Ember.inject.service('layers-styles-renderer'),

  /**
    Flag: indicates whether classification can be performed now or not.

    @property _classificationCanBePerformed
    @type Boolean
    @private
    @readOnly
  */
  _classificationCanBePerformed: Ember.computed('styleSettings.style.propertyName', function() {
    return !Ember.isBlank(this.get('styleSettings.style.propertyName'));
  }),

  /**
    Flag: indicates whether selected categories remove can be performed now or not.

    @property _removeCanBePerformed
    @type Boolean
    @private
    @readOnly
  */
  _removeCanBePerformed: Ember.computed('_selectedCategoriesCount', function() {
    return this.get('_selectedCategoriesCount') > 0;
  }),

  /**
    Hash containing indicators of selected categories.

    @property _selectedCategories
    @type Object
    @default null
    @private
  */
  _selectedCategories: null,

  /**
    Count of selected categories.

    @property _selectedCategoriesCount
    @type Number
    @default 0
    @private
  */
  _selectedCategoriesCount: 0,

  /**
    Count of categories to which layer's features must be classified.

    @property _classificationCategoriesCount
    @type Number
    @default 1
    @private
  */
  _classificationCategoriesCount: 1,

  /**
    Flag: indicates whether all categories are selected or not.

    @property _allCategoriesAreSelected
    @type Boolean
    @default false
    @private
  */
  _allCategoriesAreSelected: false,

  /**
    Name of currently active editing cell.

    @property _editingCell
    @type String
    @default null
    @private
  */
  _editingCell: null,

  /**
    Reference to component's template.
  */
  layout,

  /**
    Component's wrapping <div> CSS-classes names.

    @property classNames
    @type String[]
    @default ['graduated-layers-style']
  */
  classNames: ['graduated-layers-style'],

  /**
    Hash containing style settings.

    @property styleSettings
    @type Object
    @default null
  */
  styleSettings: null,

  /**
    Hash containing layer display settings.

    @property displaySettings
    @type Object
    @default null
  */
  displaySettings: null,

  /**
    Related layer's type.

    @property layerType
    @type String
    @default null
  */
  layerType: null,

  /**
    Related leaflet layer.

    @property leafletLayer
    @type <a href="http://leafletjs.com/reference-1.2.0.html#layer">L.Layer</a>
    @default null
  */
  leafletLayer: null,

  /**
    Observers changes in categories.
    Renderes symbols related to them.

    @method _categoriesDidChange
    @private
  */
  _categoriesDidChange: Ember.observer('styleSettings.style.categories.[]', function() {
    Ember.run.scheduleOnce('afterRender', this, '_renderCategorySymbolsOnCanvases');
  }),

  /**
    Renderes categories symbols on canvases related to them.

    @method _renderCategorySymbolsOnCanvases
    @private
  */
  _renderCategorySymbolsOnCanvases() {
    let layersStylesRenderer = this.get('_layersStylesRenderer');
    let categories = this.get('styleSettings.style.categories');
    if (!Ember.isArray(categories) || categories.length === 0) {
      return;
    }

    this.$('canvas.category-symbol-canvas').each(function() {
      let canvas = this;
      let $canvas = Ember.$(canvas);
      let categoryIndex = Number($canvas.attr('category'));
      let category = categories[categoryIndex];
      let categoryStyleSettings = Ember.get(category, 'styleSettings');

      layersStylesRenderer.renderOnCanvas({ canvas, styleSettings: categoryStyleSettings, target: 'legend' });
    });
  },

  /**
    Initializes component.
  */
  init() {
    this._super(...arguments);

    this.set('_selectedCategories', {});
  },

  /**
    Initializes component's DOM-related properties.
  */
  didInsertElement() {
    this._super(...arguments);

    this._categoriesDidChange();
  },

  /**
    Deinitializes component.
  */
  willDestroy() {
    this.set('_selectedCategories', null);

    this._super(...arguments);
  },

  actions: {
    /**
      Handles 'add category' button click event.

      @method actions.onSelectAllCategoriesCheckboxChange
      @param {Object} e Event object.
      @param {Boolean} e.checked Flag indicating whether checkbox is checked now or not.
    */
    onSelectAllCategoriesCheckboxChange({ checked }) {
      if (checked) {
        let categoriesCount = this.get('styleSettings.style.categories.length');
        this.set('_selectedCategoriesCount', categoriesCount);

        let selectedCategories = {};
        for (let i = 0; i < categoriesCount; i++) {
          selectedCategories[i + ''] = true;
        }

        this.set('_selectedCategories', selectedCategories);
      } else {
        this.set('_selectedCategoriesCount', 0);
        this.set('_selectedCategories', {});
      }
    },

    /**
      Handles 'add category' button click event.

      @method actions.onSelectCategoryCheckboxChange
      @param {Object} e Event object.
      @param {Boolean} e.checked Flag indicating whether checkbox is checked now or not.
    */
    onSelectCategoryCheckboxChange(categoryIndex, { checked }) {
      let selectedCategoriesCount = this.get('_selectedCategoriesCount');
      if (checked) {
        selectedCategoriesCount++;
      } else {
        selectedCategoriesCount--;
      }

      let categoriesCount = this.get('styleSettings.style.categories.length');
      if (selectedCategoriesCount < 0) {
        selectedCategoriesCount = 0;
      } else if (selectedCategoriesCount > categoriesCount) {
        selectedCategoriesCount = categoriesCount;
      }

      if (categoriesCount > 0 && selectedCategoriesCount === categoriesCount) {
        this.set('_allCategoriesAreSelected', true);
      } else {
        this.set('_allCategoriesAreSelected', false);
      }

      this.set('_selectedCategoriesCount', selectedCategoriesCount);
    },

    /**
      Handles 'add category' button click event.

      @method actions.onAddCategoryButtonClick
      @param {Object} e Event object.
    */
    onAddCategoryButtonClick(e) {
      let layersStylesRenderer = this.get('_layersStylesRenderer');
      let categories = this.get('styleSettings.style.categories').slice(0);
      categories.push({
        name: categories.length,
        value: null,
        styleSettings: layersStylesRenderer.getDefaultStyleSettings('simple')
      });

      this.set('styleSettings.style.categories', categories);
      this.set('_allCategoriesAreSelected', false);
    },

    /**
      Handles 'remove selected categories' button click event.

      @method actions.onRemoveSelectedCategoriesButtonClick
      @param {Object} e Event object.
    */
    onRemoveSelectedCategoriesButtonClick() {
      if (this.get('_allCategoriesAreSelected')) {
        this.set('styleSettings.style.categories', []);
      } else {
        let newCategories = [];
        let categories = this.get('styleSettings.style.categories');
        let selectedCategories = this.get('_selectedCategories');

        for (let i = 0, len = categories.length; i < len; i++) {
          if (selectedCategories[i + ''] !== true) {
            newCategories.push(categories[i]);
          }
        }

        this.set('styleSettings.style.categories', newCategories);
      }

      this.set('_selectedCategories', {});
      this.set('_selectedCategoriesCount', 0);
      this.set('_allCategoriesAreSelected', false);
    },

    /**
      Handles 'classify' button click event.

      @method actions.onClassifyButtonClick
      @param {Object} e Event object.
    */
    onClassifyButtonClick() {
      let leafletLayer = this.get('leafletLayer');
      let layerType = this.get('layerType');
      if (Ember.isBlank(layerType) || Ember.isNone(leafletLayer)) {
        return;
      }

      let layerClass = Ember.getOwner(this).lookup(`layer:${layerType}`);
      let propertyName = this.get('styleSettings.style.propertyName');

      // Get distinct array of asc. sorted values.
      let propertyValues = [...new Set(layerClass.getLayerPropertyValues(leafletLayer, propertyName))].sort((a, b) => { return a - b; });
      let categoriesCount = Number(this.get('_classificationCategoriesCount'));
      categoriesCount = isNaN(categoriesCount) ? 1 : categoriesCount;
      categoriesCount = categoriesCount <= 0 ? 1 : categoriesCount;
      categoriesCount = categoriesCount > propertyValues.length ? propertyValues.length : categoriesCount;

      let categories = [];
      let categoriesLength = (propertyValues.length - propertyValues.length % categoriesCount) / categoriesCount;
      let layersStylesRenderer = this.get('_layersStylesRenderer');

      for (let i = 0; i < categoriesCount; i++) {
        let intervalStartIndex = i * categoriesLength;
        let intervalLastIndex = i === (categoriesCount - 1) ? propertyValues.length - 1 : (i + 1) * categoriesLength - 1;
        categories.push({
          name: i,
          value: propertyValues[intervalStartIndex] + ' - ' + propertyValues[intervalLastIndex],
          styleSettings: layersStylesRenderer.getDefaultStyleSettings('simple')
        });
      }

      this.set('styleSettings.style.categories', categories);

      this.set('_selectedCategories', {});
      this.set('_selectedCategoriesCount', 0);
      this.set('_allCategoriesAreSelected', false);

      this.set('_classificationCategoriesCount', categoriesCount);
    },

    /**
      Handles editing cell 'click' event.

      @method actions.onEditingCellClick
      @param {Object} e Event object.
    */
    onEditingCellClick(editingCell, e) {
      this.set('_editingCell', editingCell);

      // Wait while input will be embeded into clicked cell (after render), and focus on it.
      Ember.run.schedule('afterRender', () => {
        let $cellInput = Ember.$(e.target).find('input').first();
        $cellInput.focus();
      });
    },

    /**
      Handles editing cell 'focusout' event.

      @method actions.onEditingCellFocusOut
      @param {String} inputText Actual input text.
      @param {Object} e Event object.
    */
    onEditingCellFocusOut(inputText, e) {
      this.set('_editingCell', null);
    },

    /**
      Handles editing cell 'keydown' event.

      @method actions.onEditingCellKeyDown
      @param {String} inputText Actual input text.
      @param {Object} e Event object.
    */
    onEditingCellKeyDown(inputText, e) {
      // If Enter (keycode: 13) or Esc (keycode: 27) was pressed, remove input from the cell.
      let code = e.keyCode || e.which;
      if (code === 13 || code === 27) {
        e.preventDefault();
        this.send('onEditingCellFocusOut', inputText, e);
      }
    }
  }
});