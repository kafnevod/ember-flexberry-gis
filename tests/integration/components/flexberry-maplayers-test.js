import Ember from 'ember';
import FlexberryMaplayersComponent from 'ember-flexberry-gis/components/flexberry-maplayers';
import FlexberryTreeComponent from 'ember-flexberry-gis/components/flexberry-tree';
import BlockSlotInstanceInitializer from 'ember-flexberry-gis/instance-initializers/block-slots';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
let app;

moduleForComponent('flexberry-maplayers', 'Integration | Component | flexberry-maplayers', {
  integration: true,
  beforeEach() {
    Ember.Component.reopen({
      i18n: Ember.inject.service('i18n')
    });
    Ember.run(function() {
      app = Ember.Application.create();
      app.deferReadiness();
      BlockSlotInstanceInitializer.initialize(app);
    });
  }
});

test('Component renders properly', function(assert) {
  assert.expect(27);

  this.render(hbs`{{flexberry-maplayers placeholder=placeholder class=class}}`);

  let $component = this.$().children();

  let $treeComponent = $component.children('div.flexberry-tree-header');
  let $placeholderComponent = $component.children('div.flexberry-tree-placeholder.title');

  let flexberryClassNames = FlexberryMaplayersComponent.flexberryClassNames;
  let flexberryTreeClassNames = FlexberryTreeComponent.flexberryClassNames;

  // Check wrapper <div>.
  assert.strictEqual($component.prop('tagName'), 'DIV', 'Component\'s wrapper is a <div>');
  assert.strictEqual(
    $component.hasClass(flexberryClassNames.wrapper),
    true,
    'Component\'s container has \'' + flexberryClassNames.wrapper + '\' css-class');
  assert.strictEqual(
    $component.hasClass(flexberryTreeClassNames.wrapper),
    true,
    'Component\'s container has \'' + flexberryTreeClassNames.wrapper + '\' css-class');
  assert.strictEqual($component.hasClass('ui'), true, 'Component\'s wrapper has \'ui\' css-class');
  assert.strictEqual($component.hasClass('accordion'), true, 'Component\'s wrapper has \'accordion\' css-class');

  // Check <placeholder>.
  assert.strictEqual($placeholderComponent.length === 1, true, 'Component has placeholder');
  assert.strictEqual(
    $placeholderComponent.hasClass('flexberry-tree-placeholder'),
    true,
    'Component\'s inner placeholder has \'flexberry-tree-placeholder\' css-class');
  assert.strictEqual($placeholderComponent.hasClass('title'), true, 'Component\'s inner placeholder has \'title\' css-class');

  // Check <tree>.
  assert.strictEqual($treeComponent.length === 1, true, 'Component has div');
  assert.strictEqual(
    $treeComponent.hasClass('flexberry-tree-header'),
    true,
    'Component\'s inner div has \'flexberry-tree-header\' css-class');

  let $labelTree = $treeComponent.children('label');
  let $divTree = $treeComponent.children('div');

  // Check <divTree>.
  assert.strictEqual($divTree.length === 1, true, 'Component has div');
  assert.strictEqual($divTree.attr('style'), 'clear: both;', 'Component\'s div is of clear: both; style');

  // Check <labelTree>.
  assert.strictEqual($labelTree.length === 1, true, 'Component has label');
  assert.strictEqual(
    $labelTree.hasClass(flexberryClassNames.addButton),
    true,
    'Component\'s container has \'' + flexberryClassNames.addButton + '\' css-class');
  assert.strictEqual(
    $labelTree.hasClass('flexberry-button'),
    true,
    'Component\'s container has \'flexberry-button\' css-class');
  assert.strictEqual($labelTree.hasClass('ui'), true, 'Component\'s wrapper has \'ui\' css-class');
  assert.strictEqual($labelTree.hasClass('button'), true, 'Component\'s wrapper has \'button\' css-class');
  assert.strictEqual($labelTree.hasClass('right'), true, 'Component\'s wrapper has \'right\' css-class');
  assert.strictEqual($labelTree.hasClass('floated'), true, 'Component\'s wrapper has \'floated\' css-class');
  assert.strictEqual($labelTree.hasClass('icon'), true, 'Component\'s wrapper has \'icon\' css-class');

  let $iconLabel = $labelTree.children('i.plus.icon');
  assert.strictEqual($iconLabel.length === 1, true, 'Component has icon');
  assert.strictEqual($iconLabel.hasClass('plus'), true, 'Component\'s wrapper has \'plus\' css-class');
  assert.strictEqual($iconLabel.hasClass('icon'), true, 'Component\'s wrapper has \'icon\' css-class');

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
  assert.expect(5);

  let latestEventObjects = {
    change: null
  };

  // Bind component's action handlers.
  this.set('actions.onAdd', e => {
    latestEventObjects.change = e;
  });
  this.render(hbs`{{flexberry-maplayers add=(action \"onAdd\")}}`);

  // Retrieve component.
  let $component = this.$().children();
  let $treeComponent = $component.children('div.flexberry-tree-header');
  let $labelTree = $treeComponent.children('label');

  assert.strictEqual($('div.ui.dimmer.modals.page').children().length === 0, true, 'No modal window');
  assert.strictEqual(latestEventObjects.change, null, 'Component\'s \'change\' action wasn\'t invoked before click');

  $labelTree.click();

  let $modal = $('div.ui.dimmer.modals.page').children();
  let $dialogAction = $modal.children('div.flexberry-dialog-toolbar.actions');
  let $approveButton = $dialogAction.children('label.flexberry-dialog-approve-button.approve.positive.ember-view.flexberry-button.ui.button');

  assert.strictEqual($modal.length === 1, true, 'Component has a modal window');
  assert.strictEqual(latestEventObjects.change, null, 'Component\'s \'change\' action wasn\'t invoked before click');

  $approveButton.click();
  assert.notStrictEqual(latestEventObjects.change, null, 'Component\'s \'change\' action was invoked after second click');
});

test('Component works properly in readonly mode', function(assert) {
  assert.expect(7);

  let latestEventObjects = {
    change: null
  };

  // Bind component's action handlers.
  this.set('actions.onAdd', e => {
    latestEventObjects.change = e;
  });

  // Render component in readonly mode.
  this.set('readonly', true);
  this.render(hbs`{{flexberry-maplayers readonly=readonly add=(action \"onAdd\")}}`);

  // Retrieve component & it's inner <input>.
  let $componentTrueReadonly = this.$().children().children('div.flexberry-tree-header').children('label');

  assert.strictEqual($('div.ui.dimmer.modals.page').children().length === 0, true, 'No modal window');
  assert.strictEqual(latestEventObjects.change, null, 'Component\'s \'change\' action wasn\'t invoked before click');

  $componentTrueReadonly.click();

  assert.strictEqual($('div.ui.dimmer.modals.page').children().length === 0, true, 'No modal window');
  assert.strictEqual(latestEventObjects.change, null, 'Component\'s \'change\' action wasn\'t invoked before click');

  // Disable readonly mode.
  this.set('readonly', false);

  let $component = this.$().children();
  let $treeComponent = $component.children('div.flexberry-tree-header');
  let $labelTree = $treeComponent.children('label');

  // Imitate click on component.
  $labelTree.click();

  let $modal = $('div.ui.dimmer.modals.page').children();
  let $dialogAction = $modal.children('div.flexberry-dialog-toolbar.actions');
  let $approveButton = $dialogAction.children('label.flexberry-dialog-approve-button.approve.positive.ember-view.flexberry-button.ui.button');

  assert.strictEqual($modal.length === 1, true, 'Component has a modal window');
  assert.strictEqual(latestEventObjects.change, null, 'Component\'s \'change\' action wasn\'t invoked before click');
  $approveButton.click();
  assert.notStrictEqual(latestEventObjects.change, null, 'Component\'s \'change\' action was invoked after second click');
});

test('Service i18n', function(assert) {
  assert.expect(2);
  this.render(hbs`
    {{flexberry-maplayers}}
  `);
  let $component = this.$().children();
  let $placeholderComponent = $component.children('div.flexberry-tree-placeholder.title');

  // En.
  assert.strictEqual(
    Ember.$.trim($placeholderComponent.text()),
    'Layers are not defined',
    'Component\'s inner <div> changes when service i18n changes locale');

  // Ru.
  Ember.run(this, () => {
    let i18n = this.container.lookup('service:i18n');
      i18n.set('locale', 'ru');
  });

  assert.strictEqual(
    Ember.$.trim($placeholderComponent.text()),
    'Слои не заданы',
    'Component\'s inner <div> changes when service i18n changes locale');
});
