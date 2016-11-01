/**
  @module ember-flexberry-gis-dummy
*/

import EditFormController from 'ember-flexberry/controllers/edit-form';
import EditFormControllerOperationsIndicationMixin from '../mixins/edit-form-controller-operations-indication';

/**
  Maps layers metadata edit controller.

  @class NewPlatformFlexberrtGISLayerMetadataEController
  @extends EditFormController
  @uses EditFormControllerOperationsIndicationMixin
*/
export default EditFormController.extend(EditFormControllerOperationsIndicationMixin, {
  /**
    Parent route.

    @property parentRoute
    @type String
    @default 'new-platform-flexberry-g-i-s-layer-metadata-l'
  */
  parentRoute: 'new-platform-flexberry-g-i-s-layer-metadata-l',
});
