import Ember from 'ember';
import LayersDialogsComponent from 'ember-flexberry-gis/components/layers-dialogs/add';
import FlexberryDialogComponent from 'ember-flexberry-gis/components/flexberry-dialog';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('layers-dialogs', 'Integration | Component | layers-dialogs/add', {
  integration: true,
  setup() {
    Ember.Component.reopen({
      i18n: Ember.inject.service('i18n')
    });
  }
});

test('Component renders properly', function(assert) {
  assert.expect(84);

  this.render(hbs`
    {{component "layers-dialogs/add" class=class caption=caption
      approveButtonCaption=approveButtonCaption
      denyButtonCaption=denyButtonCaption
      typeDropdownCaption=typeDropdownCaption
      nameTextboxCaption=nameTextboxCaption
      crsTextareaCaption=crsTextareaCaption}}
  `);

  let $component = $('div.ui.dimmer.modals.page').children();
  let $dialogIcon = $component.children('i.flexberry-dialog-close-button.close.icon');
  let $dialogHeader = $component.children('div.flexberry-dialog-header.header');
  let $dialogContent = $component.children('div.flexberry-dialog-content.content');
  let $dialogAction = $component.children('div.flexberry-dialog-toolbar.actions');
  let flexberryClassNames = LayersDialogsComponent.flexberryClassNames;
  let flexberryDialogComponentClassNames = FlexberryDialogComponent.flexberryClassNames;

  // Check wrapper <div>.
  assert.strictEqual($component.prop('tagName'), 'DIV', 'Component\'s prefix is a <div>');
  assert.strictEqual(
    $component.hasClass(flexberryClassNames.prefix),
    true,
    'Component\'s container has \'' + flexberryClassNames.prefix + '\' css-class');
  assert.strictEqual($component.hasClass('ui'), true, 'Component\'s has \'ui\' css-class');
  assert.strictEqual($component.hasClass('modal'), true, 'Component\'s has \'modal\' css-class');

  // Check wrapper <Icon>.
  assert.strictEqual($dialogIcon.length === 1, true, 'Component has inner Icon');
  assert.strictEqual(
    $dialogIcon.hasClass(flexberryDialogComponentClassNames.closeButton),
    true,
    'Component\'s inner Icon has \'' + flexberryDialogComponentClassNames.closeButton + '\' css-class');
  assert.strictEqual($dialogIcon.hasClass('close'), true, 'Component\'s inner Icon has \'close\' css-class');
  assert.strictEqual($dialogIcon.hasClass('icon'), true, 'Component\'s inner Icon has \'icon\' css-class');

  // Check wrapper <Header>.
  assert.strictEqual($dialogHeader.length === 1, true, 'Component has inner Header');
  assert.strictEqual(
    $dialogHeader.hasClass(flexberryDialogComponentClassNames.header),
    true,
    'Component\'s inner Header has \'' + flexberryDialogComponentClassNames.header + '\' css-class');
  assert.strictEqual($dialogHeader.hasClass('header'), true, 'Component\'s inner Header has \'header\' css-class');

  assert.strictEqual(
    Ember.$.trim($dialogHeader.text()).length === 0,
    true,
    'Component\'s inner Header is empty by default');

  let dialogCaptionText = 'dialog caption';
  this.set('caption', dialogCaptionText);
  assert.strictEqual(
    Ember.$.trim($dialogHeader.text()),
    dialogCaptionText,
    'Component\'s inner Header text changes when component\'s \'caption\' property changes');

  // Check wrapper <Content>.
  assert.strictEqual($dialogContent.length === 1, true, 'Component has inner Content');
  assert.strictEqual(
    $dialogContent.hasClass(flexberryDialogComponentClassNames.content),
    true,
    'Component\'s inner Content has \'' + flexberryDialogComponentClassNames.content + '\' css-class');
  assert.strictEqual($dialogContent.hasClass('content'), true, 'Component\'s inner Content has \'title\' css-class');

  // Check wrapper <form> in <Content>.
  let $dialogForm = $dialogContent.children('form.ui.form');

  // Form.
  assert.strictEqual($dialogForm.length === 1, true, 'Component has inner div');
  assert.strictEqual($dialogForm.hasClass('ui'), true, 'Component\'s inner form has \'ui\' css-class');
  assert.strictEqual($dialogForm.hasClass('form'), true, 'Component\'s inner form has \'form\' css-class');
  assert.strictEqual($dialogForm.attr('role'), 'form', 'Component\'s inner <form> is of form role');

  // Check wrapper <div> in <form>.
  let $divForm = $dialogForm.children('div.field');
  assert.strictEqual($divForm.length === 3, true, 'Component has inner div');
  assert.strictEqual($divForm.hasClass('field'), true, 'Component\'s inner div has \'field\' css-class');

  // Check wrapper <label> in <div>.
  let $labelDiv = $divForm.children('label');
  assert.strictEqual($labelDiv.length === 3, true, 'Component has inner div');
  assert.strictEqual(
    Ember.$.trim($labelDiv.text()).length === 0,
    true,
    'Component\'s inner Header is empty by default');

  let typeDropdownCaptionText = 'typeDropdownCaption';
  let nameTextboxCaptionText = 'nameTextboxCaption';
  let crsTextareaCaptionText = 'crsTextareaCaption';
  this.set('typeDropdownCaption', typeDropdownCaptionText);
  assert.strictEqual(
    Ember.$.trim($labelDiv.text()),
    typeDropdownCaptionText,
    'Component\'s inner label text changes when component\'s \'typeDropdownCaption\' property changes');

  this.set('typeDropdownCaption', '');
  this.set('nameTextboxCaption', nameTextboxCaptionText);
  assert.strictEqual(
    Ember.$.trim($labelDiv.text()),
    nameTextboxCaptionText,
    'Component\'s inner label text changes when component\'s \'nameTextboxCaption\' property changes');

  this.set('nameTextboxCaption', '');
  this.set('crsTextareaCaption', crsTextareaCaptionText);
  assert.strictEqual(
    Ember.$.trim($labelDiv.text()),
    crsTextareaCaptionText,
    'Component\'s inner label text changes when component\'s \'crsTextareaCaptionText\' property changes');
  this.set('crsTextareaCaption', '');

  // Check wrapper <div> in <form>.
  let $divWithDropdown = $divForm.children('div.flexberry-dropdown.fluid.selection.ember-view.ui.dropdown');
  let $divWithTextbox = $divForm.children('div.fluid.ember-view.flexberry-textbox.ui.input');
  let $divWithTextarea = $divForm.children('div.fluid.ember-view.flexberry-textarea.ui.input');

  // Dropdown.
  assert.strictEqual($divWithDropdown.length === 1, true, 'Component has inner Dropdown');
  assert.strictEqual($divWithDropdown.hasClass('flexberry-dropdown'), true, 'Component\'s inner Content has \'flexberry-dropdown\' css-class');
  assert.strictEqual($divWithDropdown.hasClass('fluid'), true, 'Component\'s inner Content has \'fluid\' css-class');
  assert.strictEqual($divWithDropdown.hasClass('selection'), true, 'Component\'s inner Content has \'selection\' css-class');
  assert.strictEqual($divWithDropdown.hasClass('ui'), true, 'Component\'s inner Content has \'ui\' css-class');
  assert.strictEqual($divWithDropdown.hasClass('dropdown'), true, 'Component\'s inner Content has \'dropdown\' css-class');

  let $iInDropdown = $divWithDropdown.children('i.dropdown.icon');
  let $divTextInDropdown = $divWithDropdown.children('div.default.text');
  let $divMenuInDropdown = $divWithDropdown.children('div.menu');

  assert.strictEqual($iInDropdown.length === 1, true, 'Component has inner <i>');
  assert.strictEqual($divTextInDropdown.length === 1, true, 'Component has inner <div>');
  assert.strictEqual($divMenuInDropdown.length === 1, true, 'Component has inner <div>');
  assert.strictEqual($iInDropdown.hasClass('dropdown'), true, 'Component\'s inner Content has \'dropdown\' css-class');
  assert.strictEqual($iInDropdown.hasClass('icon'), true, 'Component\'s inner Content has \'icon\' css-class');
  assert.strictEqual($divTextInDropdown.hasClass('default'), true, 'Component\'s inner Content has \'default\' css-class');
  assert.strictEqual($divTextInDropdown.hasClass('text'), true, 'Component\'s inner Content has \'text\' css-class');
  assert.strictEqual($divMenuInDropdown.hasClass('menu'), true, 'Component\'s inner Content has \'menu\' css-class');

  // Textbox.
  assert.strictEqual($divWithTextbox.length === 1, true, 'Component has inner Textbox');
  assert.strictEqual($divWithTextbox.hasClass('flexberry-textbox'), true, 'Component\'s inner Content has \'flexberry-textbox\' css-class');
  assert.strictEqual($divWithTextbox.hasClass('fluid'), true, 'Component\'s inner Content has \'fluid\' css-class');
  assert.strictEqual($divWithTextbox.hasClass('input'), true, 'Component\'s inner Content has \'input\' css-class');
  assert.strictEqual($divWithTextbox.hasClass('ui'), true, 'Component\'s inner Content has \'ui\' css-class');

  let $inputInTextbox = $divWithTextbox.children('input.ember-view.ember-text-field');

  assert.strictEqual($inputInTextbox.length === 1, true, 'Component has inner <input>');
  assert.strictEqual($inputInTextbox.hasClass('ember-text-field'), true, 'Component\'s inner Content has \'ember-text-field\' css-class');
  assert.strictEqual($inputInTextbox.attr('type'), 'text', 'Component\'s inner <input> is of text type');
  assert.strictEqual($inputInTextbox.attr('placeholder'), '(no value)', 'Component\'s inner <input> is of (no value) placeholder');

  // Textarea.
  assert.strictEqual($divWithTextarea.length === 1, true, 'Component has inner Textarea');
  assert.strictEqual($divWithTextarea.hasClass('flexberry-textarea'), true, 'Component\'s inner Content has \'flexberry-textarea\' css-class');
  assert.strictEqual($divWithTextarea.hasClass('fluid'), true, 'Component\'s inner Content has \'fluid\' css-class');
  assert.strictEqual($divWithTextarea.hasClass('input'), true, 'Component\'s inner Content has \'input\' css-class');
  assert.strictEqual($divWithTextarea.hasClass('ui'), true, 'Component\'s inner Content has \'ui\' css-class');

  let $innerTextarea = $divWithTextarea.children('textarea.ember-view.ember-text-area');

  assert.strictEqual($innerTextarea.length === 1, true, 'Component has inner <input>');
  assert.strictEqual($innerTextarea.hasClass('ember-text-area'), true, 'Component\'s inner Content has \'ember-text-area\' css-class');
  assert.strictEqual($innerTextarea.attr('placeholder'), '(no value)', 'Component\'s inner <input> is of (no value) placeholder');
  assert.strictEqual($innerTextarea.prop('tagName'), 'TEXTAREA', 'Component\'s prefix is a <textarea>');

  // Check wrapper <Action>.
  assert.strictEqual($dialogAction.length === 1, true, 'Component has inner Action');
  assert.strictEqual(
    $dialogAction.hasClass(flexberryDialogComponentClassNames.toolbar),
    true,
    'Component\'s inner Action has \'' + flexberryDialogComponentClassNames.toolbar + '\' css-class');
  assert.strictEqual($dialogAction.hasClass('actions'), true, 'Component\'s inner Action has \'actions\' css-class');

  // Check wrapper <label> in <Action>.
  let $approveButton = $dialogAction.children('label.flexberry-dialog-approve-button.approve.positive.ember-view.flexberry-button.ui.button');
  let $denyButton = $dialogAction.children('label.flexberry-dialog-cancel-button.deny.negative.ember-view.flexberry-button.ui.button');

  // approveButton.
  assert.strictEqual($approveButton.length === 1, true, 'Component has inner label');
  assert.strictEqual(
    $approveButton.hasClass(flexberryDialogComponentClassNames.approveButton),
    true,
    'Component\'s inner label has \'' + flexberryDialogComponentClassNames.approveButton + '\' css-class');
  assert.strictEqual($approveButton.hasClass('approve'), true, 'Component\'s inner label has \'approve\' css-class');
  assert.strictEqual($approveButton.hasClass('positive'), true, 'Component\'s inner label has \'positive\' css-class');
  assert.strictEqual($approveButton.hasClass('ui'), true, 'Component\'s inner label has \'ui\' css-class');
  assert.strictEqual($approveButton.hasClass('button'), true, 'Component\'s inner label has \'button\' css-class');
  assert.strictEqual($approveButton.hasClass('flexberry-button'), true, 'Component\'s inner label has \'flexberry-button\' css-class');

  assert.strictEqual(
    Ember.$.trim($approveButton.text()).length === 0,
    true,
    'Component\'s inner label is empty by default');

  let approveButtonCaptionText = 'approveButton caption';
  this.set('approveButtonCaption', approveButtonCaptionText);
  assert.strictEqual(
    Ember.$.trim($approveButton.text()),
    approveButtonCaptionText,
    'Component\'s inner label text changes when component\'s \'caption\' property changes');

  // denyButton.
  assert.strictEqual($denyButton.length === 1, true, 'Component has inner label');
  assert.strictEqual(
    $denyButton.hasClass(flexberryDialogComponentClassNames.cancelButton),
    true,
    'Component\'s inner label has \'' + flexberryDialogComponentClassNames.cancelButton + '\' css-class');
  assert.strictEqual($denyButton.hasClass('deny'), true, 'Component\'s inner label has \'deny\' css-class');
  assert.strictEqual($denyButton.hasClass('negative'), true, 'Component\'s inner label has \'negative\' css-class');
  assert.strictEqual($denyButton.hasClass('ui'), true, 'Component\'s inner label has \'ui\' css-class');
  assert.strictEqual($denyButton.hasClass('button'), true, 'Component\'s inner label has \'button\' css-class');
  assert.strictEqual($denyButton.hasClass('flexberry-button'), true, 'Component\'s inner label has \'flexberry-button\' css-class');

  assert.strictEqual(
    Ember.$.trim($denyButton.text()).length === 0,
    true,
    'Component\'s inner label is empty by default');

  let denyButtonCaptionText = 'denyButton caption';
  this.set('denyButtonCaption', denyButtonCaptionText);
  assert.strictEqual(
    Ember.$.trim($denyButton.text()),
    denyButtonCaptionText,
    'Component\'s inner label text changes when component\'s \'caption\' property changes');

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
    approveValue: null,
  };

  // Bind component's action handlers.
  this.set('actions.onApprove', e => {
    latestEventObjects.approveValue = e;
  });

  this.render(hbs`
    {{component "layers-dialogs/add" class=class caption=caption
      approveButtonCaption=approveButtonCaption
      denyButtonCaption=denyButtonCaption
      typeDropdownCaption=typeDropdownCaption
      nameTextboxCaption=nameTextboxCaption
      crsTextareaCaption=crsTextareaCaption
      visible=visible
      approve=(action \"onApprove\")
    }}
  `);
  this.set('visible', true);

  // Retrieve component.
  let $component = $('div.ui.dimmer.modals.page').children();
  let $dialogAction = $component.children('div.flexberry-dialog-toolbar.actions');
  let $approveButton = $dialogAction.children('label.flexberry-dialog-approve-button.approve.positive.ember-view.flexberry-button.ui.button');

  assert.strictEqual(latestEventObjects.approveValue, null, 'Component\'s \'change\' action wasn\'t invoked before click');

  // Imitate first click on component.
  $approveButton.click();
  assert.notStrictEqual(latestEventObjects.approveValue, null, 'Component\'s \'change\' action was invoked after first click');
  latestEventObjects.approveValue = null;

  // Imitate second click on component.
  $approveButton.click();
  assert.notStrictEqual(latestEventObjects.approveValue, null, 'Component\'s \'change\' action was invoked after second click');
});

test('Service i18n', function(assert) {
  assert.expect(12);

  this.render(hbs`
    {{component "layers-dialogs/add" class=class}}
  `);
  let $component = $('div.ui.dimmer.modals.page').children();
  let $dialogHeader = $component.children('div.flexberry-dialog-header.header');
  let $dialogContent = $component.children('div.flexberry-dialog-content.content');
  let $dialogAction = $component.children('div.flexberry-dialog-toolbar.actions');

  // En.
  assert.strictEqual(
    Ember.$.trim($dialogHeader.text()),
    'Add new layer',
    'Component\'s inner <div> changes when service i18n changes locale');

  let $dialogForm = $dialogContent.children('form.ui.form');
  let $divForm = $dialogForm.children('div.field');
  let $labelDiv = $divForm.children('label');

  assert.strictEqual(
    Ember.$.trim($labelDiv[0].innerText),
    'Layer type',
    'Component\'s inner <div> changes when service i18n changes locale');

  assert.strictEqual(
    Ember.$.trim($labelDiv[1].innerText),
    'Layer name',
    'Component\'s inner <div> changes when service i18n changes locale');

  assert.strictEqual(
    Ember.$.trim($labelDiv[2].innerText),
    'Layer coordinate reference system (CRS)',
    'Component\'s inner <div> changes when service i18n changes locale');

  let $approveButton = $dialogAction.children('label.flexberry-dialog-approve-button.approve.positive.ember-view.flexberry-button.ui.button');
  let $denyButton = $dialogAction.children('label.flexberry-dialog-cancel-button.deny.negative.ember-view.flexberry-button.ui.button');

  assert.strictEqual(
    Ember.$.trim($approveButton.text()),
    'Ok',
    'Component\'s inner <div> changes when service i18n changes locale');

  assert.strictEqual(
    Ember.$.trim($denyButton.text()),
    'Cancel',
    'Component\'s inner <div> changes when service i18n changes locale');

  // Ru.
  Ember.run(this, () => {
    let i18n = this.container.lookup('service:i18n');
      i18n.set('locale', 'ru');
  });

  assert.strictEqual(
    Ember.$.trim($dialogHeader.text()),
    'Добавление нового слоя',
    'Component\'s inner <div> changes when service i18n changes locale');

  assert.strictEqual(
    Ember.$.trim($labelDiv[0].innerText),
    'Тип слоя',
    'Component\'s inner <div> changes when service i18n changes locale');

  assert.strictEqual(
    Ember.$.trim($labelDiv[1].innerText),
    'Имя слоя',
    'Component\'s inner <div> changes when service i18n changes locale');

  assert.strictEqual(
    Ember.$.trim($labelDiv[2].innerText),
    'Система координат слоя (CRS)',
    'Component\'s inner <div> changes when service i18n changes locale');

  assert.strictEqual(
    Ember.$.trim($approveButton.text()),
    'Ok',
    'Component\'s inner <div> changes when service i18n changes locale');

  assert.strictEqual(
    Ember.$.trim($denyButton.text()),
    'Отмена',
    'Component\'s inner <div> changes when service i18n changes locale');
});
