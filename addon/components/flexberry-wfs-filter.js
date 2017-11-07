import Ember from 'ember';
import layout from '../templates/components/flexberry-wfs-filter';

export default Ember.Component.extend({
  /**
    Reference to component's template.
  */
  layout,

  /**
    Current layer filter.

    @property filter
    @type Element
    @default undefined
  */
  filter: undefined,

  /**
    String value of filter.

    @property filterStringValue
    @type String
    @default undefined
  */
  filterStringValue: undefined,

  /**
    Class for operator buttons.

    @property operatorButtonClass
    @type String
    @default 'filter-operator-button'
  */
  operatorButtonClass: 'filter-operator-button',

  /**
    Array contains Fields in current leaflet object.

    @property fields
    @type Array
    @default Ember.A()
  */
  fields: Ember.A(),

  /**
    Array contains shown values of current field.

    @property values
    @type Array
    @default Ember.A()
  */
  values: Ember.A(),

  /**
    Values count for 'Example' button.

    @property valuesCount
    @type Integer
    @default 10
  */
  valuesCount: 10,

  /**
    Leaflet's wfs layer object.

    @property _leafletObject
    @type Object
    @default null
    @private
  */
  _leafletObject: null,

  /**
    Contains selected field.

    @property _selectedField
    @type String
    @default undefined
    @private
  */
  _selectedField: undefined,

  /**
    Contains selected value.

    @property _selectedValue
    @type String
    @default undefined
    @private
  */
  _selectedValue: undefined,

  /**
    Flag indicates whether filterStringValue is correct or not.

    @property _filterIsCorrect
    @type Boolean
    @default true
    @private
  */
  _filterIsCorrect: true,

  init() {
    this._super(...arguments);

    this.set('filterStringValue', this.get('filter'));
    let type = this.get('_layerType');
    let leafletObject = this.get('_leafletObject');

    if (!(Ember.isBlank(leafletObject) || Ember.isBlank(leafletObject))) {
      let fields = Ember.A(Ember.getOwner(this).knownForType('layer', type).getLayerProperties(leafletObject));

      this.set('fields', fields);
    }
  },

  /**
    Creates filter object from string.

    @method _parseFilter
    @return {Object} Returns new created gml filter
    @private
  */
  _parseFilter() {
    let a = this.get('filterStringValue') || '';
    a = a.replace(/[\n\r]/g, '');
    let type = this.get('_layerType');
    this.set('_filterIsCorrect', false);
    let filter = Ember.getOwner(this).knownForType('layer', type).parseFilter(a);
    if (!Ember.isNone(filter)) {
      this.set('_filterIsCorrect', true);
    }

    return filter;
  },

  /**
    Paste specified string into filter string.

    @method _pasteIntoFilterString
    @param {String} pasteString String for pasting
    @param {Integer} caretShift Caret shift after string is pasted
    @private
  */
  _pasteIntoFilterString(pasteString, caretShift) {
    let textarea = this.$('.edit-filter-textarea')[0];
    let filterString = this.get('filterStringValue') || '';
    let newFilterString = '';
    let caretPosition = 0;
    if (filterString.length > 0) {
      newFilterString = `${filterString.slice(0, textarea.selectionStart)}${pasteString}${filterString.slice(textarea.selectionEnd)}`;
      caretPosition = textarea.selectionStart + pasteString.length;
    } else {
      newFilterString = pasteString;
      caretPosition = pasteString.length;
    }

    caretPosition = caretPosition + (caretShift || 0);
    this.set('filterStringValue', newFilterString);
    Ember.run.scheduleOnce('afterRender', this, function () {
      textarea.focus();
      textarea.setSelectionRange(caretPosition, caretPosition);
    });
  },

  actions: {
    /**
      This action is called when Apply button is pressed.

      @method actions.applyFilter
    */
    applyFilter() {
      this._parseFilter();
      if (this.get('_filterIsCorrect')) {
        this.set('filter', this.get('filterStringValue'));
      }
    },

    /**
      This action is called when Check button is pressed.

      @method actions.checkFilter
    */
    checkFilter() {
      this._parseFilter();
    },

    /**
      This action is called when Clear button is pressed.

      @method actions.clearFilter
    */
    clearFilter() {
      this.set('_filterIsCorrect', true);
      this.set('filter', undefined);
      this.set('filterStringValue', undefined);
    },

    /**
      This action is called when an item in Fields list is pressed.

      @method actions.fieldClick
      @param {String} text Selected field
    */
    fieldClick(text) {
      if (this.get('_selectedField') !== text) {
        this.set('values', Ember.A());
        this.set('_selectedValue', undefined);
        this.set('_selectedField', text);
      }
    },

    /**
      This action is called when an item in Values list is pressed.

      @method actions.valueClick
      @param {String} text Selected value
    */
    valueClick(text) {
      this.set('_selectedValue', text);
    },

    /**
      This action is called when "Show all" or "Show example" button is pressed.

      @method actions.showFieldValues
      @param {Integer} count Values count to show
    */
    showFieldValues(count) {
      let type = this.get('_layerType');
      let leafletObject = this.get('_leafletObject');
      let selectedField = this.get('_selectedField');
      let values = Ember.A(Ember.getOwner(this).knownForType('layer', type).getLayerPropertyValues(leafletObject, selectedField, count));
      values.sort();
      if (values.indexOf(undefined) >= 0 || values.indexOf(null) >= 0 || values.length === 0) {
        values.removeObject(undefined);
        values.removeObject(null);
        values.unshiftObject(undefined);
      }

      this.set('values', values);
    },

    /**
      Paste expression with condition into fiter string.

      @method pasteConditionExpression
      @param {String} condition
    */
    pasteConditionExpression(condition) {
      let operandBefore = this.get('_selectedField') || '';
      let operandAfter = this.get('_selectedValue') || 'NULL';
      if (operandAfter !== 'NULL') {
        operandAfter = `'${operandAfter}'`;
      }

      let expressionString = `'${operandBefore}' ${condition} ${operandAfter}`;
      this._pasteIntoFilterString(expressionString);
    },

    /**
      Paste logical expression into fiter string.

      @method pasteLogicalExpression
      @param {String} condition
    */
    pasteLogicalExpression(condition) {
      let expressionString = `${condition} ()`;
      this._pasteIntoFilterString(expressionString, -1);
    },

    /**
      Paste symbol into fiter string.

      @method pasteSymbol
      @param {String} symbol
    */
    pasteSymbol(symbol) {
      let expressionString = `${symbol}`;
      this._pasteIntoFilterString(expressionString);
    },

    /**
      Paste selected field or field value into filter string.

      @method actions.pasteFieldValue
      @param {String} value
    */
    pasteFieldValue(value) {
      if (Ember.isNone(value)) {
        this._pasteIntoFilterString('NULL');
        return;
      }

      let newString = `'${value}'`;
      this._pasteIntoFilterString(newString);
    },
  }
});
