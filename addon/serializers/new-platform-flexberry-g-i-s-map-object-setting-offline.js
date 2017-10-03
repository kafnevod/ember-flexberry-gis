/**
  @module ember-flexberry-gis
*/

import DS from 'ember-data';
import { Serializer } from 'ember-flexberry-data';
import { OfflineSerializer as MapObjectSettingSerializer } from '../mixins/regenerated/serializers/new-platform-flexberry-g-i-s-map-object-setting-offline';

/**
  Map object setting offline serializer.

  @class NewPlatformFlexberryGISMapObjectSettingOfflineSerializer
  @extends OfflineSerializer
  @uses <a href="https://www.emberjs.com/api/ember-data/2.4/classes/DS.EmbeddedRecordsMixin">DS.EmbeddedRecordsMixin</a>
  @uses NewPlatformFlexberryGISMapObjectSettingOfflineSerializerMixin
*/
export default Serializer.Offline.extend(DS.EmbeddedRecordsMixin, MapObjectSettingSerializer, {
});
