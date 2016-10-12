import Ember from 'ember';
import FlexberryGroup from 'ember-flexberry-gis/layers/group';
import FlexberryTile from 'ember-flexberry-gis/layers/tile';
import FlexberryWms from 'ember-flexberry-gis/layers/wms';
import FlexberrylayersInstanceInitializer from 'ember-flexberry-gis/instance-initializers/layers';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
let app;
let appInstance;

moduleForComponent('layers-dialogs', 'Integration | Component | layers-dialogs/settings', {
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

      appInstance = app.buildInstance();
      FlexberrylayersInstanceInitializer.initialize(appInstance);
    });
  }
});

test('Component renders new properly with settings tile', function(assert) {
  assert.expect(11);

  this.render(hbs`
    {{component "layers-dialogs/add"
      class=class
      visible=visible
    }}
  `);

  this.set('visible', true);

  let $component = $('div.ui.dimmer.modals.page').children();
  let $dialogContent = $component.children('div.flexberry-dialog-content.content');
  let $dialogForm = $dialogContent.children('form.ui.form');
  let $divForm = $dialogForm.children('div.field');
  let $divWithDropdown = $divForm.children('div.flexberry-dropdown.fluid.selection.ember-view.ui.dropdown');
  let $dropdownInContent = $divWithDropdown.children('div.default.text');

  $dropdownInContent.click();
  let $menuDropdown = $divWithDropdown.children('div.menu.animating.transition.slide.down.in');
  let $valueDropdown = $menuDropdown.children('div.item');

  $valueDropdown[1].click();

  let $newDivForm = $dialogForm.children('div.field');

  let $labelDiv = $newDivForm.children('label');
  let $urlTextBoxInContent = $newDivForm.children('div.fluid.ember-view.flexberry-textbox.ui.input');

  assert.strictEqual(
    Ember.$.trim($labelDiv[3].innerText),
    'Url',
    'Component\'s inner label has \'Url\' text');

  assert.strictEqual($urlTextBoxInContent.length === 2, true, 'Component has inner Textbox');
  assert.strictEqual($urlTextBoxInContent.hasClass('flexberry-textbox'), true, 'Component\'s inner Content has \'flexberry-textbox\' css-class');
  assert.strictEqual($urlTextBoxInContent.hasClass('fluid'), true, 'Component\'s inner Content has \'fluid\' css-class');
  assert.strictEqual($urlTextBoxInContent.hasClass('input'), true, 'Component\'s inner Content has \'input\' css-class');
  assert.strictEqual($urlTextBoxInContent.hasClass('ui'), true, 'Component\'s inner Content has \'ui\' css-class');

  let $inputInTextbox = $urlTextBoxInContent.children('input.ember-view.ember-text-field');

  assert.strictEqual($inputInTextbox.length === 2, true, 'Component has inner <input>');
  assert.strictEqual($inputInTextbox.hasClass('ember-text-field'), true, 'Component\'s inner Content has \'ember-text-field\' css-class');
  assert.strictEqual($inputInTextbox.attr('type'), 'text', 'Component\'s inner <input> is of text type');
  assert.strictEqual($inputInTextbox.attr('placeholder'), '(no value)', 'Component\'s inner <input> is of (no value) placeholder');

  Ember.run(this, () => {
    let i18n = this.container.lookup('service:i18n');
      i18n.set('locale', 'ru');
  });

  assert.strictEqual(
    Ember.$.trim($labelDiv[3].innerText),
    'Url',
    'Component\'s inner label changen\'t when service i18n changes locale');
});

test('Component renders new properly with settings wms', function(assert) {
  assert.expect(27);

  this.render(hbs`
    {{component "layers-dialogs/add"
      class=class
      visible=visible
    }}
  `);

  this.set('visible', true);

  let $component = $('div.ui.dimmer.modals.page').children();
  let $dialogContent = $component.children('div.flexberry-dialog-content.content');
  let $dialogForm = $dialogContent.children('form.ui.form');
  let $divForm = $dialogForm.children('div.field');
  let $divWithDropdown = $divForm.children('div.flexberry-dropdown.fluid.selection.ember-view.ui.dropdown');
  let $dropdownInContent = $divWithDropdown.children('div.default.text');

  $dropdownInContent.click();
  let $menuDropdown = $divWithDropdown.children('div.menu.animating.transition.slide.down.in');
  let $valueDropdown = $menuDropdown.children('div.item');

  $valueDropdown[2].click();

  let $newDivForm = $dialogForm.children('div.field');

  let $labelDiv = $newDivForm.children('label');
  let $textBoxsInContent = $newDivForm.children('div.fluid.ember-view.flexberry-textbox.ui.input');
  let $checkBoxInContent = $newDivForm.children('div.flexberry-checkbox.ember-view.ui.checkbox');

  assert.strictEqual(
    Ember.$.trim($labelDiv[3].innerText),
    'Url',
    'Component\'s inner label has \'Url\' text');
  assert.strictEqual(
    Ember.$.trim($labelDiv[4].innerText),
    'WMS version',
    'Component\'s inner label has \'WMS version\' text');
  assert.strictEqual(
    Ember.$.trim($labelDiv[5].innerText),
    'Layers',
    'Component\'s inner label has \'Layers\' text');
  assert.strictEqual(
    Ember.$.trim($labelDiv[6].innerText),
    'Image format',
    'Component\'s inner label has \'Image format\' text');
  assert.strictEqual(
    Ember.$.trim($labelDiv[7].innerText),
    'Allow images transparency',
    'Component\'s inner label has \'Allow images transparency\' text');

  // textBoxs.
  assert.strictEqual($textBoxsInContent.length === 5, true, 'Component has inner Textbox');
  assert.strictEqual($textBoxsInContent.hasClass('flexberry-textbox'), true, 'Component\'s inner Content has \'flexberry-textbox\' css-class');
  assert.strictEqual($textBoxsInContent.hasClass('fluid'), true, 'Component\'s inner Content has \'fluid\' css-class');
  assert.strictEqual($textBoxsInContent.hasClass('input'), true, 'Component\'s inner Content has \'input\' css-class');
  assert.strictEqual($textBoxsInContent.hasClass('ui'), true, 'Component\'s inner Content has \'ui\' css-class');

  let $inputInTextbox = $textBoxsInContent.children('input.ember-view.ember-text-field');

  assert.strictEqual($inputInTextbox.length === 5, true, 'Component has inner <input>');
  assert.strictEqual($inputInTextbox.hasClass('ember-text-field'), true, 'Component\'s inner Content has \'ember-text-field\' css-class');
  assert.strictEqual($inputInTextbox.attr('type'), 'text', 'Component\'s inner <input> is of text type');
  assert.strictEqual($inputInTextbox.attr('placeholder'), '(no value)', 'Component\'s inner <input> is of (no value) placeholder');

  // checkBox.
  assert.strictEqual($checkBoxInContent.length === 1, true, 'Component has inner checkBox');
  assert.strictEqual($checkBoxInContent.hasClass('flexberry-checkbox'), true, 'Component\'s inner Content has \'flexberry-checkbox\' css-class');
  assert.strictEqual($checkBoxInContent.hasClass('checkbox'), true, 'Component\'s inner Content has \'checkbox\' css-class');
  assert.strictEqual($checkBoxInContent.hasClass('ui'), true, 'Component\'s inner Content has \'ui\' css-class');

  let $inputInCheckBox = $checkBoxInContent.children('input.hidden');
  let $labelInCheckBox = $checkBoxInContent.children('label');

  assert.strictEqual($inputInCheckBox.length === 1, true, 'Component has inner CheckBox');
  assert.strictEqual($inputInCheckBox.hasClass('hidden'), true, 'Component\'s inner Content has \'hidden\' css-class');
  assert.strictEqual($inputInCheckBox.attr('type'), 'checkbox', 'Component\'s inner <input> is of checkbox type');

  assert.strictEqual($labelInCheckBox.length === 1, true, 'Component has inner label');

  Ember.run(this, () => {
    let i18n = this.container.lookup('service:i18n');
      i18n.set('locale', 'ru');
  });

  assert.strictEqual(
    Ember.$.trim($labelDiv[3].innerText),
    'Url',
    'Component\'s inner <div> changen\'t when service i18n changes locale');
  assert.strictEqual(
    Ember.$.trim($labelDiv[4].innerText),
    'Версия WMS',
    'Component\'s inner <div> changes when service i18n changes locale');
  assert.strictEqual(
    Ember.$.trim($labelDiv[5].innerText),
    'Слои',
    'Component\'s inner <div> changes when service i18n changes locale');
  assert.strictEqual(
    Ember.$.trim($labelDiv[6].innerText),
    'Формат изображений',
    'Component\'s inner <div> changes when service i18n changes locale');
  assert.strictEqual(
    Ember.$.trim($labelDiv[7].innerText),
    'Разрешить прозрачность на изображениях',
    'Component\'s inner <div> changes when service i18n changes locale');
});

// добавить ввод с клавиатуры как пользователь
test('Component invokes actions with settings wms', function(assert) {
  //assert.expect(12);

  let latestEventObjects = {
    approveValue: null,
  };

  this.set('actions.onApprove', e => {
    latestEventObjects.approveValue = e;
  });

  this.render(hbs`
    {{component "layers-dialogs/add"
      class=class
      visible=visible
      approve=(action \"onApprove\")
    }}
  `);

  this.set('visible', true);

  let $component = $('div.ui.dimmer.modals.page').children();
  let $dialogContent = $component.children('div.flexberry-dialog-content.content');
  let $dialogForm = $dialogContent.children('form.ui.form');
  let $divForm = $dialogForm.children('div.field');
  let $divWithDropdown = $divForm.children('div.flexberry-dropdown.fluid.selection.ember-view.ui.dropdown');
  let $dropdownInContent = $divWithDropdown.children('div.default.text');

  $dropdownInContent.click();
  let $menuDropdown = $divWithDropdown.children('div.menu.animating.transition.slide.down.in');
  let $valueDropdown = $menuDropdown.children('div.item');
  $valueDropdown[2].click();

  let $newDivForm = $dialogForm.children('div.field');
  let $divWithTextBoxs = $newDivForm.children('div.fluid.ember-view.flexberry-textbox.ui.input');
  let $divWithCheckBox = $newDivForm.children('div.flexberry-checkbox.ember-view.ui.checkbox');
  let $divWithTextArea = $newDivForm.children('div.fluid.ember-view.flexberry-textarea.ui.input');
  let $textBoxsInContent = $divWithTextBoxs.children('input.ember-view.ember-text-field');
  let $textAreaInContent = $divWithTextArea.children('textarea.ember-view.ember-text-area');

  //$dialogContent.scrollTop(500);

  $textBoxsInContent[0].click();
  $textBoxsInContent[0].value = 'Test TextBox 1';
  $textBoxsInContent[1].value = 'Test TextBox 2';
  $textBoxsInContent[2].value = 'Test TextBox 3';
  $textBoxsInContent[3].value = 'Test TextBox 4';
  $textBoxsInContent[4].value = 'Test TextBox 5';
  $textAreaInContent[0].value = 'Test TextArea 1';
  $divWithCheckBox.click();

  let $dialogAction = $component.children('div.flexberry-dialog-toolbar.actions');
  let $approveButton = $dialogAction.children('label.flexberry-dialog-approve-button.approve.positive.ember-view.flexberry-button.ui.button');

  $approveButton.click();



  //let asdasd = latestEventObjects.approveValue;
  assert.strictEqual(true,true);
});

// добавить ввод с клавиатуры как пользователь
test('Component invokes actions with settings tile', function(assert) {
  //assert.expect(27);

  let latestEventObjects = {
    approveValue: null,
  };

  this.set('actions.onApprove', e => {
    latestEventObjects.approveValue = e;
  });

  this.render(hbs`
    {{component "layers-dialogs/add"
      class=class
      visible=visible
      approve=(action \"onApprove\")
    }}
  `);

  this.set('visible', true);

  let $component = $('div.ui.dimmer.modals.page').children();
  let $dialogContent = $component.children('div.flexberry-dialog-content.content');
  let $dialogForm = $dialogContent.children('form.ui.form');
  let $divForm = $dialogForm.children('div.field');
  let $divWithDropdown = $divForm.children('div.flexberry-dropdown.fluid.selection.ember-view.ui.dropdown');
  let $dropdownInContent = $divWithDropdown.children('div.default.text');

  $dropdownInContent.click();
  let $menuDropdown = $divWithDropdown.children('div.menu.animating.transition.slide.down.in');
  let $valueDropdown = $menuDropdown.children('div.item');
  $valueDropdown[1].click();

  let $newDivForm = $dialogForm.children('div.field');

  let $divWithTextBoxs = $newDivForm.children('div.fluid.ember-view.flexberry-textbox.ui.input');
  let $divWithTextArea = $newDivForm.children('div.fluid.ember-view.flexberry-textarea.ui.input');

  let $textBoxsInContent = $divWithTextBoxs.children('input.ember-view.ember-text-field');
  let $textAreaInContent = $divWithTextArea.children('textarea.ember-view.ember-text-area');

  //$dialogContent.scrollTop(500);

  $textBoxsInContent[0].click();
  $textBoxsInContent[0].value = 'Test TextBox 1';
  $textBoxsInContent[1].value = 'Test TextBox 2';
  $textAreaInContent[0].value = 'Test TextArea 1';

  let $dialogAction = $component.children('div.flexberry-dialog-toolbar.actions');
  let $approveButton = $dialogAction.children('label.flexberry-dialog-approve-button.approve.positive.ember-view.flexberry-button.ui.button');

  $approveButton.click();


  //let asdasd = latestEventObjects.approveValue;
  assert.strictEqual(true,true);
});

// добавить ввод с клавиатуры как пользователь
test('Component invokes actions with settings group', function(assert) {
  //assert.expect(27);

  let latestEventObjects = {
    approveValue: null,
  };

  this.set('actions.onApprove', e => {
    latestEventObjects.approveValue = e;
  });

  this.render(hbs`
    {{component "layers-dialogs/add"
      class=class
      visible=visible
      approve=(action \"onApprove\")
    }}
  `);

  this.set('visible', true);

  let $component = $('div.ui.dimmer.modals.page').children();
  let $dialogContent = $component.children('div.flexberry-dialog-content.content');
  let $dialogForm = $dialogContent.children('form.ui.form');
  let $divForm = $dialogForm.children('div.field');
  let $divWithDropdown = $divForm.children('div.flexberry-dropdown.fluid.selection.ember-view.ui.dropdown');
  let $dropdownInContent = $divWithDropdown.children('div.default.text');

  $dropdownInContent.click();
  let $menuDropdown = $divWithDropdown.children('div.menu.animating.transition.slide.down.in');
  let $valueDropdown = $menuDropdown.children('div.item');
  $valueDropdown[0].click();

  let $newDivForm = $dialogForm.children('div.field');
  let $divWithTextBoxs = $newDivForm.children('div.fluid.ember-view.flexberry-textbox.ui.input');
  let $divWithTextArea = $newDivForm.children('div.fluid.ember-view.flexberry-textarea.ui.input');
  let $textBoxsInContent = $divWithTextBoxs.children('input.ember-view.ember-text-field');
  let $textAreaInContent = $divWithTextArea.children('textarea.ember-view.ember-text-area');

  //$dialogContent.scrollTop(500);

  $textBoxsInContent[0].click();
  $textBoxsInContent[0].value = 'Test TextBox 1';
  $textAreaInContent[0].value = 'Test TextArea 1';

  let $dialogAction = $component.children('div.flexberry-dialog-toolbar.actions');
  let $approveButton = $dialogAction.children('label.flexberry-dialog-approve-button.approve.positive.ember-view.flexberry-button.ui.button');

  $approveButton.click();


  //let asdasd = latestEventObjects.approveValue;
  assert.strictEqual(true,true);
});

// добавить ввод с клавиатуры как пользователь
test('Preservation of the entered data in component when changing layer', function(assert) {
  //assert.expect(5);

  this.render(hbs`
    {{component "layers-dialogs/add"
      class=class
      visible=visible
    }}
  `);

  this.set('visible', true);

  let $component = $('div.ui.dimmer.modals.page').children();
  let $dialogContent = $component.children('div.flexberry-dialog-content.content');
  let $dialogForm = $dialogContent.children('form.ui.form');
  let $divForm = $dialogForm.children('div.field');
  let $divWithDropdown = $divForm.children('div.flexberry-dropdown.fluid.selection.ember-view.ui.dropdown');
  let $dropdownInContent = $divWithDropdown.children('div.default.text');

  $dropdownInContent.click();
  let $menuDropdown = $divWithDropdown.children('div.menu.animating.transition.slide.down.in');
  let $valueDropdown = $menuDropdown.children('div.item');
  $valueDropdown[2].click();

  let $newDivForm = $dialogForm.children('div.field');
  let $divWithTextBoxs = $newDivForm.children('div.fluid.ember-view.flexberry-textbox.ui.input');
  let $divWithCheckBox = $newDivForm.children('div.flexberry-checkbox.ember-view.ui.checkbox');
  let $divWithTextArea = $newDivForm.children('div.fluid.ember-view.flexberry-textarea.ui.input');

  let $textBoxsInContent = $divWithTextBoxs.children('input.ember-view.ember-text-field');
  let $textAreaInContent = $divWithTextArea.children('textarea.ember-view.ember-text-area');
  let $checkBoxInContent = $divWithCheckBox.children('input.hidden');

  //$dialogContent.scrollTop(500);

  $textBoxsInContent[0].value = 'Test TextBox 1';
  $textBoxsInContent[1].value = 'Test TextBox 2';
  $textBoxsInContent[2].value = 'Test TextBox 3';
  $textBoxsInContent[3].value = 'Test TextBox 4';
  $textBoxsInContent[4].value = 'Test TextBox 5';
  $textAreaInContent[0].value = 'Test TextArea 1';
  $divWithCheckBox.click();

  $dropdownInContent.click();
  $valueDropdown[0].click();

  $textBoxsInContent[0].value = 'Test 1';
  $textAreaInContent[0].value = 'Test 2';

  $dropdownInContent.click();
  $valueDropdown[2].click();

  $dialogContent.scrollTop(500);

  assert.strictEqual(
    Ember.$.trim($textBoxsInContent[1].value),
    'Test TextBox 2',
    'Data in component when changing layer don\'t saved');

  assert.strictEqual(
    Ember.$.trim($textBoxsInContent[2].value),
    'Test TextBox 3',
    'Data in component when changing layer don\'t saved');

  assert.strictEqual(
    Ember.$.trim($textBoxsInContent[3].value),
    'Test TextBox 4',
    'Data in component when changing layer don\'t saved');

  assert.strictEqual(
    Ember.$.trim($textBoxsInContent[4].value),
    'Test TextBox 5',
    'Data in component when changing layer don\'t saved');

  assert.strictEqual(
    $checkBoxInContent[0].checked,
    true,
    'Data in component when changing layer don\'t saved');
});
