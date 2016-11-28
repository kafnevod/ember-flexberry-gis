import Ember from 'ember';
import RequiredActionsMixin from 'ember-flexberry-gis/mixins/required-actions';
import { module, test } from 'qunit';

module('Integration | Mixin | required-actions mixin');

let MixinImplementation = Ember.Object.extend(RequiredActionsMixin);

test('it works', function (assert) {
  assert.expect(1);
  let subject = MixinImplementation.create({
    sendAction: () => { }
  });
  assert.ok(subject);
});

test('it works with requiredActionNames', function (assert) {
  assert.expect(1);
  let subject = MixinImplementation.create({
    _requiredActionNames: ['test1'],
    sendAction: () => { }
  });
  assert.ok(subject);

});
