import Ember from 'ember';
import FlexberryTreeComponent from 'ember-flexberry-gis/components/flexberry-tree';
import TreeNodeObject from 'ember-flexberry-gis/objects/tree-node';
import BlockSlotInstanceInitializer from 'ember-flexberry-gis/instance-initializers/block-slots';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
let app;

moduleForComponent('flexberry-tree', 'Integration | Component | flexberry-tree', {
  integration: true,
  beforeEach() {
  Ember.run(function() {
      app = Ember.Application.create();
      app.deferReadiness();
      BlockSlotInstanceInitializer.initialize(app);
    });
  }
});

test('Component renders properly', function(assert) {
  assert.expect(12);

  this.render(hbs`{{flexberry-tree class=class placeholder=placeholder}}`);

  // Retrieve component.
  let $component = this.$().children();
  let flexberryClassNames = FlexberryTreeComponent.flexberryClassNames;

  assert.strictEqual($component.prop('tagName'), 'DIV', 'Component\'s wrapper is a <div>');
  assert.strictEqual(
    $component.hasClass(flexberryClassNames.wrapper),
    true,
    'Component\'s container has \'' + flexberryClassNames.wrapper + '\' css-class');
  assert.strictEqual(
    $component.hasClass(flexberryClassNames.root),
    true,
    'Component\'s container has \'' + flexberryClassNames.root + '\' css-class');
  assert.strictEqual($component.hasClass('accordion'), true, 'Component\'s wrapper has \'accordion\' css-class');
  assert.strictEqual($component.hasClass('ui'), true, 'Component\'s wrapper has \'ui\' css-class');

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

  let $treeDiv = $component.children('div');

  // Check <div>.
  assert.strictEqual($treeDiv.length === 1, true, 'Component has inner <div>');
  assert.strictEqual(
    $treeDiv.hasClass(flexberryClassNames.placeholder),
    true,
    'Component\'s inner tree <div> has \'' + flexberryClassNames.placeholder + '\' css-class');
  assert.strictEqual($treeDiv.hasClass('title'), true, 'Component\'s inner tree <div> has \'hidden\' css-class');
});

test('Component root level', function(assert) {
  assert.expect(5);

  this.render(hbs`{{flexberry-tree class=class placeholder=placeholder nodes=nodes}}`);

  let $component = this.$().children();
  let flexberryClassNames = FlexberryTreeComponent.flexberryClassNames;

  assert.strictEqual(
    $component.hasClass(flexberryClassNames.root),
    true,
    'Component\'s container has \'' + flexberryClassNames.root + '\' css-class');
  assert.strictEqual($component.hasClass('ui'), true, 'Component\'s wrapper has \'ui\' css-class');

  let testRoot = Ember.A([
    TreeNodeObject.create({
      caption: 'Node 1',
      nodes: Ember.A([
        TreeNodeObject.create({
          caption: 'Node 1.1',
          nodes: null
        })
      ])
    })
  ]);
  this.set('nodes', testRoot);

  let $treeNode = $component.children('div');
  let $treeNodeContent = $treeNode.children('div.flexberry-treenode-content.content');
  let $treeLvlTwo = $treeNodeContent.children('div');

  assert.notStrictEqual(
    $treeLvlTwo.hasClass(flexberryClassNames.root),
    true,
    'Component\'s container hasn\'t \'' + flexberryClassNames.root + '\' css-class');
  assert.notStrictEqual($treeLvlTwo.hasClass('ui'), true, 'Component\'s wrapper hasn\'t \'ui\' css-class');
  assert.strictEqual($treeLvlTwo.hasClass('accordion'), true, 'Component\'s wrapper has \'accordion\' css-class');
});
