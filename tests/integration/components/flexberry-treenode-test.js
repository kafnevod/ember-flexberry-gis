import Ember from 'ember';
import FlexberryTreenodeComponent from 'ember-flexberry-gis/components/flexberry-treenode';
import TreeNodeObject from 'ember-flexberry-gis/objects/tree-node';
import BlockSlotInstanceInitializer from 'ember-flexberry-gis/instance-initializers/block-slots';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
let app;

moduleForComponent('flexberry-treenode', 'Integration | Component | flexberry-treenode', {
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
  assert.expect(19);

  this.render(hbs`{{flexberry-treenode class=class caption=caption}}`);

  let $component = this.$().children();
  let $treeNodeHeader = $component.children('div.flexberry-treenode-header.title');
  let $treeNodeContent = $component.children('div.flexberry-treenode-content.content');
  let flexberryClassNames = FlexberryTreenodeComponent.flexberryClassNames;

  // Check wrapper <div>.
  assert.strictEqual($component.prop('tagName'), 'DIV', 'Component\'s wrapper is a <div>');
  assert.strictEqual(
    $component.hasClass(flexberryClassNames.wrapper),
    true,
    'Component\'s container has \'' + flexberryClassNames.wrapper + '\' css-class');

  // Check wrapper <Header>.
  assert.strictEqual($treeNodeHeader.length === 1, true, 'Component has inner Header');
  assert.strictEqual(
    $treeNodeHeader.hasClass(flexberryClassNames.header),
    true,
    'Component\'s inner Header has \'' + flexberryClassNames.header + '\' css-class');
  assert.strictEqual($treeNodeHeader.hasClass('title'), true, 'Component\'s inner Header has \'title\' css-class');

  assert.strictEqual(
    Ember.$.trim($treeNodeHeader.text()).length === 0,
    true,
    'Component\'s inner Header is empty by default');

  let treeNodeCaptionText = 'treeNode caption';
  this.set('caption', treeNodeCaptionText);
  assert.strictEqual(
    Ember.$.trim($treeNodeHeader.text()),
    treeNodeCaptionText,
    'Component\'s inner Header text changes when component\'s \'caption\' property changes');

  // Check wrapper <Content>.
  assert.strictEqual($treeNodeContent.length === 1, true, 'Component has inner Content');
  assert.strictEqual(
    $treeNodeContent.hasClass(flexberryClassNames.content),
    true,
    'Component\'s inner Content has \'' + flexberryClassNames.content + '\' css-class');
  assert.strictEqual($treeNodeContent.hasClass('content'), true, 'Component\'s inner Content has \'title\' css-class');

  // Check wrapper <i> in <Header>.
  let $treeNodeI = $treeNodeHeader.children('i');

  assert.strictEqual($treeNodeI.length === 1, true, 'Component has inner i');
  assert.strictEqual(
    $treeNodeI.hasClass(flexberryClassNames.expandCollapseIcon),
    true,
    'Component\'s inner i has \'' + flexberryClassNames.expandCollapseIcon + '\' css-class');
  assert.strictEqual($treeNodeI.hasClass('dropdown'), true, 'Component\'s inner i has \'dropdown\' css-class');
  assert.strictEqual($treeNodeI.hasClass('icon'), true, 'Component\'s inner i has \'icon\' css-class');
  assert.strictEqual($treeNodeI.attr('style'), 'visibility: hidden;', 'Component\'s inner i is of visibility: hidden style');

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
  this.set('actions.onHeaderClick', e => {
    latestEventObjects.test = e;
  });
  this.render(hbs`{{flexberry-treenode class=class caption=caption headerClick=(action \"onHeaderClick\")}}`);

  // Retrieve component.
  let $component = this.$().children();
  let $treeNodeHeader = $component.children('div.flexberry-treenode-header.title');
  assert.strictEqual(latestEventObjects.test, null, 'Component\'s \'test\' action wasn\'t invoked before click');

  // Imitate first click on component.
  $treeNodeHeader.click();
  assert.notStrictEqual(latestEventObjects.test, null, 'Component\'s \'test\' action was invoked after first click');

  // Imitate second click on component.
  latestEventObjects.test = null;
  $treeNodeHeader.click();
  assert.notStrictEqual(latestEventObjects.test, null, 'Component\'s \'test\' action was invoked after second click');
});

test('Component renders properly after invokes actions', function(assert) {
  assert.expect(2);
  this.render(hbs`{{flexberry-tree class=class placeholder=placeholder nodes=nodes}}`);

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

  let $component = this.$().children();
  let $treeNodeHeader = $component.children('div').children('div.flexberry-treenode-header.title');
  let $treeNodeContent = $component.children('div').children('div.flexberry-treenode-content.content');

  $treeNodeHeader.click();

  return new Ember.Test.promise((resolve) => {
    Ember.run(this, () => {
      setTimeout(function() {
        resolve();
      }, 500);
    });
  })
  .then(function(result) {
    assert.strictEqual($treeNodeHeader.hasClass('active'), true, 'Component\'s inner header has \'active\' css-class');
    assert.strictEqual($treeNodeContent.hasClass('active'), true, 'Component\'s inner content has \'active\' css-class');
  });
});

test('Block usage', function(assert) {
  assert.expect(4);

  let latestEventObjects = {
    testHeader: null,
    testContent: null
  };

  this.set('actions.testHeader', e => {
    latestEventObjects.testHeader = 'Header';
  });

  this.set('actions.testContent', e => {
    latestEventObjects.testContent = 'Content';
  });

  this.render(hbs`
    {{#flexberry-treenode class=class placeholder=placeholder nodes=nodes}}
      {{#block-slot "header"}}
        <button {{action 'testHeader'}}>Test header</button>
      {{/block-slot}}
      {{#block-slot "content"}}
        <button {{action 'testContent'}}>Test content</button>
      {{/block-slot}}
    {{/flexberry-treenode}}
    `);

  let $component = this.$().children();
  let $treeNodeHeader = $component.children('div.flexberry-treenode-header.title');
  let $treeNodeContent = $component.children('div.flexberry-treenode-content.content');
  let $buttonHeader = $treeNodeHeader.children('button');
  let $buttonContent = $treeNodeContent.children('button');

  assert.strictEqual(latestEventObjects.testHeader, null, 'Component\'s \'test\' action wasn\'t invoked before click');
  $buttonHeader.click();
  assert.notStrictEqual(latestEventObjects.testHeader, null, 'Component\'s \'test\' action was invoked after first click');

  assert.strictEqual(latestEventObjects.testContent, null, 'Component\'s \'test\' action wasn\'t invoked before click');
  $buttonContent.click();
  assert.notStrictEqual(latestEventObjects.testContent, null, 'Component\'s \'test\' action was invoked after first click');
});
