import Ember from 'ember';
import LayersInstanceInitializer from 'ember-flexberry-gis/instance-initializers/layers';
import { module, test } from 'qunit';
import { availableLayerTypes } from 'ember-flexberry-gis/utils/layers';

let application;
let appInstance;

module('Integration | Instance Initializer | Layers', {
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      application.deferReadiness();

      let oldMetod = application.__registry__.resolver.knownForType;
      let newMetod = application.__registry__.resolver.knownForType = function() {
         return Object({
           ['layer:group']: true,
           ['layer:tile'] : true,
           ['layer:wms'] : true
        });
      };
      if (application.__registry__.resolver.knownForType('layer')) {
        application.__registry__.resolver.knownForType = newMetod;
      }
      else {
        application.__registry__.resolver.knownForType = oldMetod;
      }
      appInstance = application.buildInstance();
    });
  }
});

test('it works', function(assert) {
  assert.expect(1);
  LayersInstanceInitializer.initialize(appInstance);
  assert.ok(true);
});

test('add true logic', function(assert) {
  assert.expect(4);
  LayersInstanceInitializer.initialize(appInstance);
  var testArr = availableLayerTypes();
  assert.strictEqual(testArr.length, 3);
  assert.strictEqual(testArr[0], 'group');
  assert.strictEqual(testArr[1], 'tile');
  assert.strictEqual(testArr[2], 'wms');
});
