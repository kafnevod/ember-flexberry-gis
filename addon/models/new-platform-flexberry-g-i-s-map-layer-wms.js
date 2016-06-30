/**
  @module ember-flexberry-gis
*/

import DS from 'ember-data';
import BaseModel from 'ember-flexberry/models/base';

/**
  Model to display wms layer settings.

  @class NewPlatformFlexberryGISMapLayerWmsModel
  @extends BaseModel
*/
let Model = BaseModel.extend({
  url: DS.attr('string'),
  layers: DS.attr('string'),
  styles: DS.attr('string'),
  format: DS.attr('string'),
  transparent: DS.attr('boolean'),
  version: DS.attr('string'),
  crs: DS.attr('string'),

  validations: {
    url: { presence: true }
  }
});

export default Model;
