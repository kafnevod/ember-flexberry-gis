import Ember from 'ember';
import FlexberryIconComponent from 'ember-flexberry-gis/components/flexberry-icon';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('flexberry-icon', 'Integration | Component | flexberry-icon', {
  integration: true
});

test('Component renders properly', function(assert) {
  assert.expect(6);

  this.render(hbs`{{flexberry-icon class=class}}`);

  // Retrieve component.
  let $component = this.$().children();
  let flexberryClassNames = FlexberryIconComponent.flexberryClassNames;

  assert.strictEqual($component.prop('tagName'), 'I');
  assert.strictEqual(
    $component.hasClass(flexberryClassNames.wrapper),
    true,
    'Component\'s container has \'' + flexberryClassNames.wrapper + '\' css-class');

  // Check wrapper's additional CSS-classes.
  let additioanlCssClasses = 'additional-css-class-name and-another-one';
  this.set('class', additioanlCssClasses);

  Ember.A(additioanlCssClasses.split(' ')).forEach((cssClassName, index) => {
    assert.strictEqual(
    $component.hasClass(cssClassName),
    true,
    'Component\'s wrapper has additional css class \'' + cssClassName + '\'');
  });

  this.set('class', '');
  Ember.A(additioanlCssClasses.split(' ')).forEach((cssClassName, index) => {
    assert.strictEqual(
    $component.hasClass(cssClassName),
    false,
    'Component\'s wrapper hasn\'t additional css class \'' + cssClassName + '\'');
  });
});
