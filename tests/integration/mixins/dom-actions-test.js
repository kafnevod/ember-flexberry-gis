import Ember from 'ember';
import DomActionsMixin from 'ember-flexberry-gis/mixins/dom-actions';
import { module, test } from 'qunit';

module('Integration | Mixin | dom-actions mixin');

let MixinImplementation = Ember.Object.extend(DomActionsMixin);

test('it works', function (assert) {
  assert.expect(1);
  let subject = MixinImplementation.create();
  assert.ok(subject);
});

test('it works', function (assert) {
  //assert.expect(1);

  assert.strictEqual(true, true);
});
