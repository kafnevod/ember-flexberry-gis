import Ember from 'ember';
import FlexberryGroup from 'ember-flexberry-gis/layers/group';
import FlexberryTile from 'ember-flexberry-gis/layers/tile';
import FlexberryWms from 'ember-flexberry-gis/layers/wms';
import FlexberryTreenodeComponent from 'ember-flexberry-gis/components/flexberry-treenode';
import FlexberryMaplayerComponent from 'ember-flexberry-gis/components/flexberry-maplayer';
import FlexberryDdauCheckboxComponent from 'ember-flexberry-gis/components/flexberry-ddau-checkbox';
import FlexberrylayersInstanceInitializer from 'ember-flexberry-gis/instance-initializers/layers';
import BlockSlotInstanceInitializer from 'ember-flexberry-gis/instance-initializers/block-slots';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
let app;

moduleForComponent('flexberry-maplayer', 'Integration | Component | flexberry-maplayer', {
  integration: true,
  setup() {
    Ember.Component.reopen({
      i18n: Ember.inject.service('i18n')
    });
    Ember.run(function() {
      app = Ember.Application.create();
      app.setupForTesting();
      app.injectTestHelpers();

      app.register('layer:group', FlexberryGroup);
      app.register('layer:tile', FlexberryTile);
      app.register('layer:wms', FlexberryWms);

      let oldMetod = app.__registry__.resolver.knownForType;
      let newMetod = app.__registry__.resolver.knownForType = function() {
         return Object({
           ['layer:group']: true,
           ['layer:tile'] : true,
           ['layer:wms'] : true
          });
        };
      if (app.__registry__.resolver.knownForType('layer')) {
        app.__registry__.resolver.knownForType = newMetod;
      }
      else {
        app.__registry__.resolver.knownForType = oldMetod;
      }

      let appInstance = app.buildInstance();
      BlockSlotInstanceInitializer.initialize(app);
      FlexberrylayersInstanceInitializer.initialize(appInstance);
    });
  }
});

test('Component renders properly', function(assert) {
  assert.expect(69);
  this.set('type', `group`);
  this.render(hbs`{{flexberry-maplayer type=type class=class}}`);

  let $component = this.$().children();
  let flexberryTreenodeClassNames = FlexberryTreenodeComponent.flexberryClassNames;
  let flexberryMaplayerClassNames = FlexberryMaplayerComponent.flexberryClassNames;
  let flexberryDdauCheckboxClassNames = FlexberryDdauCheckboxComponent.flexberryClassNames;

  // Check wrapper <div>.
  assert.strictEqual($component.prop('tagName'), 'DIV', 'Component\'s wrapper is a <div>');
  assert.strictEqual(
    $component.hasClass(flexberryTreenodeClassNames.wrapper),
    true,
    'Component\'s container has \'' + flexberryTreenodeClassNames.wrapper + '\' css-class');

  let $headerComponent  = $component.children('div.flexberry-treenode-header.title');
  let $contentComponent  = $component.children('div.flexberry-treenode-content.content');

  assert.strictEqual($headerComponent.length === 1, true, 'Component has inner <div>');
  assert.strictEqual(
    $headerComponent.hasClass(flexberryTreenodeClassNames.header),
    true,
    'Component\'s inner <div> has \'' + flexberryTreenodeClassNames.header + '\' css-class');
  assert.strictEqual($headerComponent.hasClass('title'), true, 'Component\'s inner <div> has \'title\' css-class');

  assert.strictEqual($contentComponent.length === 1, true, 'Component has inner <div>');
  assert.strictEqual(
    $contentComponent.hasClass(flexberryTreenodeClassNames.content),
    true,
    'Component\'s inner <div> has \'' + flexberryTreenodeClassNames.content + '\' css-class');
  assert.strictEqual($contentComponent.hasClass('content'), true, 'Component\'s inner <div> has \'content\' css-class');

  // In header.
  let $iCollapseIcon = $headerComponent.children('i.flexberry-treenode-expand-collapse-icon.dropdown.icon');
  let $divCheckbox = $headerComponent.children('div.flexberry-maplayer-visibility-checkbox.flexberry-treenode-prevent-expand-collapse.ember-view.flexberry-checkbox.ui.checkbox');
  let $iTypeIcon = $headerComponent.children('i.flexberry-maplayer-type-icon.folder.icon.ember-view.flexberry-icon');
  let $labelRemoveButton = $headerComponent.children('label.flexberry-maplayer-remove-button.right.floated.flexberry-treenode-prevent-expand-collapse.ember-view.flexberry-button.ui.button.icon');
  let $labelEditButton = $headerComponent.children('label.flexberry-maplayer-edit-button.right.floated.flexberry-treenode-prevent-expand-collapse.ember-view.flexberry-button.ui.button.icon');
  let $labelAddButton = $headerComponent.children('label.flexberry-maplayer-add-button.right.floated.flexberry-treenode-prevent-expand-collapse.ember-view.flexberry-button.ui.button.icon');
  let $divStyle = $headerComponent.children('div');

  // iCollapseIcon.
  assert.strictEqual($iCollapseIcon.length === 1, true, 'Component has inner <i>');
  assert.strictEqual($iCollapseIcon.attr('style'), 'visibility: hidden;', 'Component\'s inner <i> is of visibility: hidden; style');
  assert.strictEqual(
    $iCollapseIcon.hasClass(flexberryTreenodeClassNames.expandCollapseIcon),
    true,
    'Component\'s inner checkbox <input> has \'' + flexberryTreenodeClassNames.expandCollapseIcon + '\' css-class');
  assert.strictEqual($iCollapseIcon.hasClass('dropdown'), true, 'Component\'s inner <i> has \'dropdown\' css-class');
  assert.strictEqual($iCollapseIcon.hasClass('icon'), true, 'Component\'s inner <i> has \'icon\' css-class');

  // divCheckbox.
  assert.strictEqual($divCheckbox.length === 1, true, 'Component has inner <div>');
  assert.strictEqual(
    $divCheckbox.hasClass(flexberryMaplayerClassNames.preventExpandCollapse),
    true,
    'Component\'s inner checkbox <div> has \'' + flexberryMaplayerClassNames.preventExpandCollapse + '\' css-class');
  assert.strictEqual(
    $divCheckbox.hasClass(flexberryMaplayerClassNames.visibilityCheckbox),
    true,
    'Component\'s inner checkbox <div> has \'' + flexberryMaplayerClassNames.visibilityCheckbox + '\' css-class');
  assert.strictEqual($divCheckbox.hasClass('checkbox'), true, 'Component\'s inner <div> has \'checkbox\' css-class');
  assert.strictEqual($divCheckbox.hasClass('ui'), true, 'Component\'s inner <div> has \'ui\' css-class');
  assert.strictEqual($divCheckbox.hasClass('flexberry-checkbox'), true, 'Component\'s inner <div> has \'flexberry-checkbox\' css-class');

  let $innerLabelInCheckbox = $divCheckbox.children('label.flexberry-checkbox-caption');
  let $innerInputInCheckbox = $divCheckbox.children('input.flexberry-checkbox-input.ember-view.ember-checkbox.hidden');

  // innerInputInCheckbox.
  assert.strictEqual($innerInputInCheckbox.length === 1, true, 'Component has inner <input>');
  assert.strictEqual($innerInputInCheckbox.attr('type'), 'checkbox', 'Component\'s inner <input> is of checkbox type');
  assert.strictEqual(
    $innerInputInCheckbox.hasClass(flexberryDdauCheckboxClassNames.checkboxInput),
    true,
    'Component\'s inner checkbox <input> has \'' + flexberryDdauCheckboxClassNames.checkboxInput + '\' css-class');
  assert.strictEqual($innerInputInCheckbox.hasClass('hidden'), true, 'Component\'s inner checkbox <input> has \'hidden\' css-class');

  // innerLabelInCheckbox.
  assert.strictEqual($innerLabelInCheckbox.length === 1, true, 'Component has inner <label>');
  assert.strictEqual(
    $innerLabelInCheckbox.hasClass(flexberryDdauCheckboxClassNames.checkboxCaption),
    true,
    'Component\'s inner <label> has \'' + flexberryDdauCheckboxClassNames.checkboxCaption + '\' css-class');
  assert.strictEqual(
    Ember.$.trim($innerLabelInCheckbox.text()).length === 0,
    true,
    'Component\'s inner <label> is empty by default');

  // iTypeIcon.
  assert.strictEqual($iTypeIcon.length === 1, true, 'Component has inner <i>');
  assert.strictEqual(
    $iTypeIcon.hasClass(flexberryMaplayerClassNames.typeIcon),
    true,
    'Component\'s inner checkbox <input> has \'' + flexberryMaplayerClassNames.typeIcon + '\' css-class');
  assert.strictEqual($iTypeIcon.hasClass('flexberry-icon'), true, 'Component\'s inner <i> has \'flexberry-icon\' css-class');
  assert.strictEqual($iTypeIcon.hasClass('icon'), true, 'Component\'s inner <i> has \'icon\' css-class');
  assert.strictEqual($iTypeIcon.hasClass('folder'), true, 'Component\'s inner <i> has \'folder\' css-class');

  // labelRemoveButton.
  assert.strictEqual($labelRemoveButton.length === 1, true, 'Component has inner <label>');
  assert.strictEqual(
    $labelRemoveButton.hasClass(flexberryMaplayerClassNames.removeButton),
    true,
    'Component\'s inner <label> has \'' + flexberryMaplayerClassNames.removeButton + '\' css-class');
  assert.strictEqual(
    $labelRemoveButton.hasClass(flexberryMaplayerClassNames.preventExpandCollapse),
    true,
    'Component\'s inner <label> has \'' + flexberryMaplayerClassNames.preventExpandCollapse + '\' css-class');
  assert.strictEqual($labelRemoveButton.hasClass('flexberry-button'), true, 'Component\'s inner <label> has \'flexberry-button\' css-class');
  assert.strictEqual($labelRemoveButton.hasClass('ui'), true, 'Component\'s inner <label> has \'ui\' css-class');
  assert.strictEqual($labelRemoveButton.hasClass('button'), true, 'Component\'s inner <label> has \'button\' css-class');
  assert.strictEqual($labelRemoveButton.hasClass('icon'), true, 'Component\'s inner <label> has \'icon\' css-class');
  assert.strictEqual($labelRemoveButton.hasClass('right'), true, 'Component\'s inner <label> has \'right\' css-class');
  assert.strictEqual($labelRemoveButton.hasClass('floated'), true, 'Component\'s inner <label> has \'floated\' css-class');

  let $iInRemoveButton = $labelRemoveButton.children('i.trash.icon');
  assert.strictEqual($iInRemoveButton.length === 1, true, 'Component has inner <i>');
  assert.strictEqual($iInRemoveButton.hasClass('trash'), true, 'Component\'s inner <i> has \'trash\' css-class');
  assert.strictEqual($iInRemoveButton.hasClass('icon'), true, 'Component\'s inner <i> has \'icon\' css-class');

  // labelEditButton.
  assert.strictEqual($labelEditButton.length === 1, true, 'Component has inner <label>');
  assert.strictEqual(
    $labelEditButton.hasClass(flexberryMaplayerClassNames.editButton),
    true,
    'Component\'s inner <label> has \'' + flexberryMaplayerClassNames.editButton + '\' css-class');
  assert.strictEqual(
    $labelEditButton.hasClass(flexberryMaplayerClassNames.preventExpandCollapse),
    true,
    'Component\'s inner <label> has \'' + flexberryMaplayerClassNames.preventExpandCollapse + '\' css-class');
  assert.strictEqual($labelEditButton.hasClass('flexberry-button'), true, 'Component\'s inner <label> has \'flexberry-button\' css-class');
  assert.strictEqual($labelEditButton.hasClass('ui'), true, 'Component\'s inner <label> has \'ui\' css-class');
  assert.strictEqual($labelEditButton.hasClass('button'), true, 'Component\'s inner <label> has \'button\' css-class');
  assert.strictEqual($labelEditButton.hasClass('icon'), true, 'Component\'s inner <label> has \'icon\' css-class');
  assert.strictEqual($labelEditButton.hasClass('right'), true, 'Component\'s inner <label> has \'right\' css-class');
  assert.strictEqual($labelEditButton.hasClass('floated'), true, 'Component\'s inner <label> has \'floated\' css-class');

  let $iInEditButton = $labelEditButton.children('i.edit.icon');
  assert.strictEqual($iInEditButton.length === 1, true, 'Component has inner <i>');
  assert.strictEqual($iInEditButton.hasClass('edit'), true, 'Component\'s inner <i> has \'edit\' css-class');
  assert.strictEqual($iInEditButton.hasClass('icon'), true, 'Component\'s inner <i> has \'icon\' css-class');

  // labelAddButton.
  assert.strictEqual($labelAddButton.length === 1, true, 'Component has inner <label>');
  assert.strictEqual(
    $labelAddButton.hasClass(flexberryMaplayerClassNames.addButton),
    true,
    'Component\'s inner <label> has \'' + flexberryMaplayerClassNames.addButton + '\' css-class');
  assert.strictEqual(
    $labelAddButton.hasClass(flexberryMaplayerClassNames.preventExpandCollapse),
    true,
    'Component\'s inner <label> has \'' + flexberryMaplayerClassNames.preventExpandCollapse + '\' css-class');
  assert.strictEqual($labelAddButton.hasClass('flexberry-button'), true, 'Component\'s inner <label> has \'flexberry-button\' css-class');
  assert.strictEqual($labelAddButton.hasClass('ui'), true, 'Component\'s inner <label> has \'ui\' css-class');
  assert.strictEqual($labelAddButton.hasClass('button'), true, 'Component\'s inner <label> has \'button\' css-class');
  assert.strictEqual($labelAddButton.hasClass('icon'), true, 'Component\'s inner <label> has \'icon\' css-class');
  assert.strictEqual($labelAddButton.hasClass('right'), true, 'Component\'s inner <label> has \'right\' css-class');
  assert.strictEqual($labelAddButton.hasClass('floated'), true, 'Component\'s inner <label> has \'floated\' css-class');

  let $iInAddButton = $labelAddButton.children('i.plus.icon');
  assert.strictEqual($iInAddButton.length === 1, true, 'Component has inner <i>');
  assert.strictEqual($iInAddButton.hasClass('plus'), true, 'Component\'s inner <i> has \'plus\' css-class');
  assert.strictEqual($iInAddButton.hasClass('icon'), true, 'Component\'s inner <i> has \'icon\' css-class');

  // divStyle.
  assert.strictEqual($divStyle.length === 2, true, 'Component has inner <label>');
  assert.strictEqual(Ember.$($divStyle[1]).attr('style'), 'clear: both;', 'Component\'s inner <div> is of \"clear: both;\" style');

  // Check wrapper's additional CSS-classes.
  let additioanlCssClasses = 'additional-css-class-name and-another-one';
  this.set('class', additioanlCssClasses);
});

test('Component invokes actions add', function(assert) {
  assert.expect(5);

  let latestEventObjects = {
    change: null
  };

  // Bind component's action handlers.
  this.set('actions.onAdd', e => {
    latestEventObjects.change = e;
  });
  this.set('type', `group`);
  this.render(hbs`{{flexberry-maplayer type=type add=(action \"onAdd\")}}`);

  // Retrieve component.
  let $component = this.$().children();
  let $headerComponent  = $component.children('div.flexberry-treenode-header.title');
  let $labelAddButton = $headerComponent.children('label.flexberry-maplayer-add-button.right.floated.flexberry-treenode-prevent-expand-collapse.ember-view.flexberry-button.ui.button.icon');

  assert.strictEqual($('div.ui.dimmer.modals.page').children().length === 0, true, 'No modal window');
  assert.strictEqual(latestEventObjects.change, null, 'Component\'s \'change\' action wasn\'t invoked before click');

  $labelAddButton.click();

  let $modal = $('div.ui.dimmer.modals.page').children();
  let $dialogAction = $modal.children('div.flexberry-dialog-toolbar.actions');
  let $approveButton = $dialogAction.children('label.flexberry-dialog-approve-button.approve.positive.ember-view.flexberry-button.ui.button');

  assert.strictEqual($modal.length === 1, true, 'Component has a modal window');
  assert.strictEqual(latestEventObjects.change, null, 'Component\'s \'change\' action wasn\'t invoked before click');

  $approveButton.click();
  assert.notStrictEqual(latestEventObjects.change, null, 'Component\'s \'change\' action was invoked after second click');
});

test('Component invokes actions edit', function(assert) {
  assert.expect(5);

  let latestEventObjects = {
    change: null
  };

  // Bind component's action handlers.
  this.set('actions.onEdit', e => {
    latestEventObjects.change = e;
  });
  this.set('type', `group`);
  this.render(hbs`{{flexberry-maplayer type=type edit=(action \"onEdit\")}}`);

  // Retrieve component.
  let $component = this.$().children();
  let $headerComponent  = $component.children('div.flexberry-treenode-header.title');
  let $labelEditButton = $headerComponent.children('label.flexberry-maplayer-edit-button.right.floated.flexberry-treenode-prevent-expand-collapse.ember-view.flexberry-button.ui.button.icon');

  assert.strictEqual($('div.ui.dimmer.modals.page').children().length === 0, true, 'No modal window');
  assert.strictEqual(latestEventObjects.change, null, 'Component\'s \'change\' action wasn\'t invoked before click');

  $labelEditButton.click();

  let $modal = $('div.ui.dimmer.modals.page').children();
  let $dialogAction = $modal.children('div.flexberry-dialog-toolbar.actions');
  let $approveButton = $dialogAction.children('label.flexberry-dialog-approve-button.approve.positive.ember-view.flexberry-button.ui.button');

  assert.strictEqual($modal.length === 1, true, 'Component has a modal window');
  assert.strictEqual(latestEventObjects.change, null, 'Component\'s \'change\' action wasn\'t invoked before click');

  $approveButton.click();
  assert.notStrictEqual(latestEventObjects.change, null, 'Component\'s \'change\' action was invoked after second click');
});

test('Component invokes actions remove', function(assert) {
  assert.expect(5);

  let latestEventObjects = {
    change: null
  };

  // Bind component's action handlers.
  this.set('actions.onRemove', e => {
    latestEventObjects.change = e;
  });
  this.set('type', `group`);
  this.render(hbs`{{flexberry-maplayer type=type remove=(action \"onRemove\")}}`);

  // Retrieve component.
  let $component = this.$().children();
  let $headerComponent  = $component.children('div.flexberry-treenode-header.title');
  let $labelRemoveButton = $headerComponent.children('label.flexberry-maplayer-remove-button.right.floated.flexberry-treenode-prevent-expand-collapse.ember-view.flexberry-button.ui.button.icon');

  assert.strictEqual($('div.ui.dimmer.modals.page').children().length === 0, true, 'No modal window');
  assert.strictEqual(latestEventObjects.change, null, 'Component\'s \'change\' action wasn\'t invoked before click');

  $labelRemoveButton.click();

  let $modal = $('div.ui.dimmer.modals.page').children();
  let $dialogAction = $modal.children('div.flexberry-dialog-toolbar.actions');
  let $approveButton = $dialogAction.children('label.flexberry-dialog-approve-button.approve.positive.ember-view.flexberry-button.ui.button');

  assert.strictEqual($modal.length === 1, true, 'Component has a modal window');
  assert.strictEqual(latestEventObjects.change, null, 'Component\'s \'change\' action wasn\'t invoked before click');

  $approveButton.click();
  assert.notStrictEqual(latestEventObjects.change, null, 'Component\'s \'change\' action was invoked after second click');
});

test('Component invokes actions headerClick', function(assert) {
  assert.expect(2);

  let latestEventObjects = {
    change: null
  };

  // Bind component's action handlers.
  this.set('actions.onheaderClick', e => {
    latestEventObjects.change = e;
  });
  this.set('type', `group`);
  this.render(hbs`{{flexberry-maplayer type=type headerClick=(action \"onheaderClick\")}}`);

  // Retrieve component.
  let $component = this.$().children();
  let $headerComponent  = $component.children('div.flexberry-treenode-header.title');

  assert.strictEqual(latestEventObjects.change, null, 'Component\'s \'change\' action wasn\'t invoked before click');
  $headerComponent.click();
  assert.notStrictEqual(latestEventObjects.change, null, 'Component\'s \'change\' action was invoked after second click');
});

test('Component invokes actions changeVisibility', function(assert) {
  assert.expect(2);

  let latestEventObjects = {
    change: null
  };

  // Bind component's action handlers.
  this.set('actions.onchangeVisibility', e => {
    latestEventObjects.change = e;
  });
  this.set('type', `group`);
  this.render(hbs`{{flexberry-maplayer type=type changeVisibility=(action \"onchangeVisibility\")}}`);

  // Retrieve component.
  let $component = this.$().children();
  let $headerComponent  = $component.children('div.flexberry-treenode-header.title');
  let $divCheckbox = $headerComponent.children('div.flexberry-maplayer-visibility-checkbox.flexberry-treenode-prevent-expand-collapse.ember-view.flexberry-checkbox.ui.checkbox');

  assert.strictEqual(latestEventObjects.change, null, 'Component\'s \'change\' action wasn\'t invoked before click');
  $divCheckbox.click();
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
  this.set('type', `group`);
  this.render(hbs`{{flexberry-maplayer type=type readonly=readonly add=(action \"onAdd\")}}`);

  // Retrieve component & it's inner <input>.
  let $componentTrueReadonlyRemoveButton = this.$().children().children('div.flexberry-treenode-header.title').children('label.flexberry-maplayer-remove-button.right.floated.flexberry-treenode-prevent-expand-collapse.ember-view.flexberry-button.ui.button.icon');
  let $componentTrueReadonlyEditButton = this.$().children().children('div.flexberry-treenode-header.title').children('label.flexberry-maplayer-edit-button.right.floated.flexberry-treenode-prevent-expand-collapse.ember-view.flexberry-button.ui.button.icon');
  let $componentTrueReadonlyAddButton = this.$().children().children('div.flexberry-treenode-header.title').children('label.flexberry-maplayer-add-button.right.floated.flexberry-treenode-prevent-expand-collapse.ember-view.flexberry-button.ui.button.icon');

  assert.strictEqual($('div.ui.dimmer.modals.page').children().length === 0, true, 'No modal window');
  assert.strictEqual(latestEventObjects.change, null, 'Component\'s \'change\' action wasn\'t invoked before click');

  $componentTrueReadonlyRemoveButton.click();
  $componentTrueReadonlyEditButton.click();
  $componentTrueReadonlyAddButton.click();

  assert.strictEqual($('div.ui.dimmer.modals.page').children().length === 0, true, 'No modal window');
  assert.strictEqual(latestEventObjects.change, null, 'Component\'s \'change\' action wasn\'t invoked before click');

  // Disable readonly mode.
  this.set('readonly', false);

  let $component = this.$().children();
  let $headerComponent  = $component.children('div.flexberry-treenode-header.title');
  let $labelAddButton = $headerComponent.children('label.flexberry-maplayer-add-button.right.floated.flexberry-treenode-prevent-expand-collapse.ember-view.flexberry-button.ui.button.icon');

  // Imitate click on component.
  $labelAddButton.click();

  let $modal = $('div.ui.dimmer.modals.page').children();
  let $dialogAction = $modal.children('div.flexberry-dialog-toolbar.actions');
  let $approveButton = $dialogAction.children('label.flexberry-dialog-approve-button.approve.positive.ember-view.flexberry-button.ui.button');

  assert.strictEqual($modal.length === 1, true, 'Component has a modal window');
  assert.strictEqual(latestEventObjects.change, null, 'Component\'s \'change\' action wasn\'t invoked before click');
  $approveButton.click();
  assert.notStrictEqual(latestEventObjects.change, null, 'Component\'s \'change\' action was invoked after second click');
});
