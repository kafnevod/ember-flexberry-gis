import { moduleForModel, test } from 'ember-qunit';

moduleForModel('new-platform-flexberry-g-i-s-map', 'Unit | Model | new-platform-flexberry-g-i-s-map', {
needs: [
    'model:new-platform-flexberry-g-i-s-map-layer'
  ]
});

test('it exists', function(assert) {
  let model = this.subject();

  // let store = this.store();
  assert.ok(!!model);
});