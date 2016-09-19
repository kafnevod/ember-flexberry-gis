import Ember from 'ember';
import LayersUtils from 'ember-flexberry-gis/utils/layers';
import { module, test } from 'qunit';

let arrLayers;

module('Integration | Utils | Layers', {
  beforeEach() {
    Ember.run(function() {
      arrLayers = ['group','tile','wms'];
    });
  }
});

test('remembers layers types', function(assert) {
  assert.expect(1);
  LayersUtils._setAvailableLayerTypes(arrLayers);
  assert.ok(true);
});

test('returns layers string[]', function(assert) {
  assert.expect(1);
  LayersUtils._setAvailableLayerTypes(arrLayers);
  let layers = LayersUtils.availableLayerTypes();
  assert.strictEqual(layers, arrLayers);
});

test('returns layers boolean', function(assert) {
  assert.expect(4);
  LayersUtils._setAvailableLayerTypes(arrLayers);
  assert.strictEqual(LayersUtils.isAvailableLayerType('group'), true);
  assert.strictEqual(LayersUtils.isAvailableLayerType('tile'), true);
  assert.strictEqual(LayersUtils.isAvailableLayerType('wms'), true);
  assert.strictEqual(LayersUtils.isAvailableLayerType('wfs'), false);
});
