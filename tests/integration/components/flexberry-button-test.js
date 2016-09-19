import Ember from 'ember';
import FlexberryButtonComponent from 'ember-flexberry-gis/components/flexberry-button';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('flexberry-button', 'Integration | Component | flexberry-button', {
  integration: true
});

test('Component renders properly', function(assert) {
  assert.expect(10);

  this.render(hbs`{{flexberry-button caption=caption class=class}}`);

  // Retrieve component.
  let $component = this.$().children();
  let flexberryClassNames = FlexberryButtonComponent.flexberryClassNames;

  // Check wrapper <label>.
  assert.strictEqual($component.prop('tagName'), 'LABEL');
  assert.strictEqual(
    $component.hasClass(flexberryClassNames.wrapper),
    true,
    'Component\'s container has \'' + flexberryClassNames.wrapper + '\' css-class');
  assert.strictEqual($component.hasClass('ui'), true, 'Component\'s wrapper has \'ui\' css-class');
  assert.strictEqual($component.hasClass('button'), true, 'Component\'s wrapper has \'button\' css-class');

  assert.strictEqual(
    Ember.$.trim($component.text()).length === 0,
    true,
    'Component\'s <label> is empty by default');

  let buttonCaptionText = 'Button caption';
  this.set('caption', buttonCaptionText);
  assert.strictEqual(
    Ember.$.trim($component.text()),
    buttonCaptionText,
    'Component\'s <label> text changes when component\'s \'caption\' property changes');

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

test('Component invokes actions', function(assert) {
  assert.expect(3);

  let latestEventObjects = {
    test: null
  };

  // Bind component's action handlers.
  this.set('actions.onButtonClick', e => {
    latestEventObjects.test = e;
  });

  this.render(hbs`{{flexberry-button caption=caption class=class click=(action \"onButtonClick\")}}`);

  // Retrieve component.
  let $component = this.$().children();

  assert.strictEqual(latestEventObjects.test, null, 'Component\'s \'change\' action wasn\'t invoked before click');

  // Imitate first click on component.
  $component.click();
  assert.notStrictEqual(latestEventObjects.test, null, 'Component\'s \'change\' action was invoked after first click');

  // Imitate second click on component.
  latestEventObjects.test = null;
  $component.click();
  assert.notStrictEqual(latestEventObjects.test, null, 'Component\'s \'change\' action was invoked after second click');
});

test('Component works properly in readonly mode', function(assert) {
  assert.expect(4);

  let latestEventObjects = {
    test: null
  };

  // Bind component's action handlers.
  this.set('actions.onButtonClick', e => {
    latestEventObjects.test = e;
  });

  this.render(hbs`{{flexberry-button caption=caption readonly=readonly class=class click=(action \"onButtonClick\")}}`);

  this.set('readonly', true);

  // Retrieve component.
  let $component = this.$().children();

  $component.click();
  assert.strictEqual($component.hasClass('disabled'),true);

  $component.click();
  assert.strictEqual(latestEventObjects.test, null, 'Component doesn\'t send \'change\' action in readonly mode');

  this.set('readonly', false);
  assert.strictEqual($component.hasClass('disabled'),false);

  latestEventObjects.test = null;
  $component.click();
  assert.notStrictEqual(latestEventObjects.test, null, 'Component send \'change\' action after readonly mode disabling');
});

test('Icon and icon with caption', function(assert) {
  assert.expect(6);

  this.render(hbs`{{flexberry-button caption=caption class=class iconClass=iconClass}}`);
  this.set('caption', 'Test button');
  this.set('iconClass', 'edit icon');

  let $component = this.$().children();
  let $buttonInput = $component.children('i');

  assert.strictEqual($buttonInput.hasClass('icon'),true);
  assert.strictEqual($buttonInput.hasClass('edit'),true);
  assert.strictEqual($component.hasClass('icon'),false);

  this.set('caption', null);
  assert.strictEqual($component.hasClass('icon'),true);
  assert.strictEqual($buttonInput.hasClass('icon'),true);
  assert.strictEqual($buttonInput.hasClass('edit'),true);
});
