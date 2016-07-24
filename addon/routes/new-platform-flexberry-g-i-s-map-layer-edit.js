/**
  @module ember-flexberry-gis
*/

import EditFormRoute from 'ember-flexberry/routes/edit-form';
import NewPlatformFlexberryGISMapLayerSettingRouteMixin
  from 'ember-flexberry-gis/mixins/new-platform-flexberry-g-i-s-map-layer-setting-route';

/**
  Route for edit form of {{#crossLink "NewPlatformFlexberryGISMapLayer"}}{{/crossLink}}.

  @class NewPlatformFlexberryGISMapLayerEditRoute
  @extends EditFormRoute
  @uses NewPlatformFlexberryGISMapLayerSettingRouteMixin
*/
export default EditFormRoute.extend(NewPlatformFlexberryGISMapLayerSettingRouteMixin, {
  /**
    Name of model projection to be used as record's properties limitation.

    @property modelProjection
    @type String
    @default 'MapLayerE'
  */
  modelProjection: 'MapLayerE',

  /**
    Name of model to be used as form's record type.

    @property modelName
    @type String
    @default 'new-platform-flexberry-g-i-s-map-layer'
  */
  modelName: 'new-platform-flexberry-g-i-s-map-layer',
});