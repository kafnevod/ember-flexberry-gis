/**
  @module ember-flexberry-gis
*/

import SelectMapTool from './select';

/**
  Polygon select map-tool.

  @class PolygonSelectMapTool
  @extends SelectMapTool
*/
export default SelectMapTool.extend({
  /**
    Handles map's 'editable:drawing:end' event.

    @method _drawingDidEnd
    @param {Object} e Event object.
    @param {<a href="http://leafletjs.com/reference-1.0.0.html#polygon">L.Polygon</a>} e.layer Drawn polygon layer.
  */
  _drawingDidEnd({ layer }) {
    this._super(...arguments);

    layer.disableEdit();

    // Remove drawn polygon.
    if (this.get('hideOnDrawingEnd')) {
      layer.remove();
    }

    // Give to user ability to draw new polygon.
    this.get('_editTools').startPolygon();
  },

  /**
    Enables tool.

    @method _enable
    @private
  */
  _enable() {
    this._super(...arguments);
    this.get('_editTools').startPolygon();
  }
});
