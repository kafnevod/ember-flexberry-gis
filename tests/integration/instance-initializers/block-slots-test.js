import Ember from 'ember';
import BlockSlotInstanceInitializer from 'ember-flexberry-gis/instance-initializers/block-slots';
import { module, test } from 'qunit';
import SlotsMixin from 'ember-block-slots';
let application;

module('Integration | Instance Initializer | block-slots', {
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      application.deferReadiness();
    });
  }
});

test('it works', function(assert) {
  assert.expect(1);
  BlockSlotInstanceInitializer.initialize(application);
  assert.ok(true);
});

test('add true logic', function(assert) {
  assert.expect(3);
  BlockSlotInstanceInitializer.initialize(application);

  assert.notStrictEqual(SlotsMixin.mixins[1].properties.parentViewExcludingSlots, undefined);
  assert.strictEqual(SlotsMixin.mixins[1].properties.parentViewExcludingSlots._dependentKeys[0], 'parentView');
  assert.strictEqual(SlotsMixin.mixins[1].properties.parentViewExcludingSlots._dependentKeys[1], 'targetObject');
});
