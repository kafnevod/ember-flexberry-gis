import Ember from 'ember';
import ArrayHelper from 'ember-flexberry-gis/helpers/array';
import { module, test } from 'qunit';
let arr;

module('Integration | Helper | Array', {
  beforeEach() {
    Ember.run(function() {
      arr = [1, 'two', 3, 'four', 5];
    });
  }
});

test('it works', function(assert) {
  assert.expect(2);

  var helper = new ArrayHelper();
  var newArr = helper.compute(arr);

  assert.strictEqual(Array.isArray(newArr),true);
  assert.strictEqual(newArr,arr);
});
