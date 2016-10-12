import Ember from 'ember';
import LayersDialogsComponent from 'ember-flexberry-gis/components/layers-dialogs/remove';
import FlexberryDialogComponent from 'ember-flexberry-gis/components/flexberry-dialog';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('layers-dialogs', 'Integration | Component | layers-dialogs/remove', {
  integration: true,
  setup() {
    Ember.Component.reopen({
      i18n: Ember.inject.service('i18n')
    });
  }
});

test('Component renders properly', function(assert) {
  assert.expect(43);

  this.render(hbs`
    {{component "layers-dialogs/remove" class=class caption=caption content=content
      approveButtonCaption=approveButtonCaption
      denyButtonCaption=denyButtonCaption
    }}
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
  assert.strictEqual(
    $component.hasClass(flexberryDialogComponentClassNames.prefix),
    true,
    'Component\'s container has \'' + flexberryDialogComponentClassNames.prefix + '\' css-class');
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

  let contentText = 'text content';
  this.set('caption', contentText);
  assert.strictEqual(
    Ember.$.trim($dialogHeader.text()),
    contentText,
    'Component\'s inner Header text changes when component\'s \'content\' property changes');

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
    {{component "layers-dialogs/remove" class=class caption=caption content=content
      approveButtonCaption=approveButtonCaption
      denyButtonCaption=denyButtonCaption
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
  assert.expect(8);

  this.render(hbs`
    {{component "layers-dialogs/remove" class=class}}
  `);
  let $component = $('div.ui.dimmer.modals.page').children();
  let $dialogHeader = $component.children('div.flexberry-dialog-header.header');
  let $dialogContent = $component.children('div.flexberry-dialog-content.content');
  let $dialogAction = $component.children('div.flexberry-dialog-toolbar.actions');

  // En.
  assert.strictEqual(
    Ember.$.trim($dialogHeader.text()),
    'Remove layer',
    'Component\'s inner <div> changes when service i18n changes locale');

  assert.strictEqual(
    Ember.$.trim($dialogContent.text()),
    'Do you really want to remove \'\' layer?',
    'Component\'s inner <div> changes when service i18n changes locale');

  let $approveButton = $dialogAction.children('label.flexberry-dialog-approve-button.approve.positive.ember-view.flexberry-button.ui.button');
  let $denyButton = $dialogAction.children('label.flexberry-dialog-cancel-button.deny.negative.ember-view.flexberry-button.ui.button');

  assert.strictEqual(
    Ember.$.trim($approveButton.text()),
    'Yes',
    'Component\'s inner <div> changes when service i18n changes locale');

  assert.strictEqual(
    Ember.$.trim($denyButton.text()),
    'No',
    'Component\'s inner <div> changes when service i18n changes locale');

  // Ru.
  Ember.run(this, () => {
    let i18n = this.container.lookup('service:i18n');
      i18n.set('locale', 'ru');
  });

  assert.strictEqual(
    Ember.$.trim($dialogHeader.text()),
    'Удаление слоя',
    'Component\'s inner <div> changes when service i18n changes locale');

  assert.strictEqual(
    Ember.$.trim($dialogContent.text()),
    'Вы действительно хотите удалить слой \'\'?',
    'Component\'s inner <div> changes when service i18n changes locale');

  assert.strictEqual(
    Ember.$.trim($approveButton.text()),
    'Да',
    'Component\'s inner <div> changes when service i18n changes locale');

  assert.strictEqual(
    Ember.$.trim($denyButton.text()),
    'Нет',
    'Component\'s inner <div> changes when service i18n changes locale');
});
