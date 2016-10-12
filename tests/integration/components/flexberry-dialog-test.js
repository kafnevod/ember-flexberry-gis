import Ember from 'ember';
import FlexberryDialogComponent from 'ember-flexberry-gis/components/flexberry-dialog';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('flexberry-dialog', 'Integration | Component | flexberry-dialog', {
  integration: true,
});

test('Component renders properly', function(assert) {
  assert.expect(41);

  this.render(hbs`{{flexberry-dialog class=class caption=caption approveButtonCaption=approveButtonCaption denyButtonCaption=denyButtonCaption}}`);

  let $component = $('div.ui.dimmer.modals.page').children();
  let $dialogIcon = $component.children('i.flexberry-dialog-close-button.close.icon');
  let $dialogHeader = $component.children('div.flexberry-dialog-header.header');
  let $dialogContent = $component.children('div.flexberry-dialog-content.content');
  let $dialogAction = $component.children('div.flexberry-dialog-toolbar.actions');
  let flexberryClassNames = FlexberryDialogComponent.flexberryClassNames;

  // Check wrapper <div>.
  assert.strictEqual($component.prop('tagName'), 'DIV', 'Component\'s wrapper is a <div>');
  assert.strictEqual(
    $component.hasClass(flexberryClassNames.wrapper),
    true,
    'Component\'s container has \'' + flexberryClassNames.wrapper + '\' css-class');
  assert.strictEqual($component.hasClass('ui'), true, 'Component\'s has \'ui\' css-class');
  assert.strictEqual($component.hasClass('modal'), true, 'Component\'s has \'modal\' css-class');

  // Check wrapper <Icon>.
  assert.strictEqual($dialogIcon.length === 1, true, 'Component has inner Icon');
  assert.strictEqual(
    $dialogIcon.hasClass(flexberryClassNames.closeButton),
    true,
    'Component\'s inner Icon has \'' + flexberryClassNames.closeButton + '\' css-class');
  assert.strictEqual($dialogIcon.hasClass('close'), true, 'Component\'s inner Icon has \'close\' css-class');
  assert.strictEqual($dialogIcon.hasClass('icon'), true, 'Component\'s inner Icon has \'icon\' css-class');

  // Check wrapper <Header>.
  assert.strictEqual($dialogHeader.length === 1, true, 'Component has inner Header');
  assert.strictEqual(
    $dialogHeader.hasClass(flexberryClassNames.header),
    true,
    'Component\'s inner Header has \'' + flexberryClassNames.header + '\' css-class');
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
    $dialogContent.hasClass(flexberryClassNames.content),
    true,
    'Component\'s inner Content has \'' + flexberryClassNames.content + '\' css-class');
  assert.strictEqual($dialogContent.hasClass('content'), true, 'Component\'s inner Content has \'title\' css-class');

  // Check wrapper <Action>.
  assert.strictEqual($dialogAction.length === 1, true, 'Component has inner Action');
  assert.strictEqual(
    $dialogAction.hasClass(flexberryClassNames.toolbar),
    true,
    'Component\'s inner Action has \'' + flexberryClassNames.toolbar + '\' css-class');
  assert.strictEqual($dialogAction.hasClass('actions'), true, 'Component\'s inner Action has \'actions\' css-class');

  // Check wrapper <label> in <Action>.
  let $approveButton = $dialogAction.children('label.flexberry-dialog-approve-button.approve.positive.ember-view.flexberry-button.ui.button');
  let $denyButton = $dialogAction.children('label.flexberry-dialog-cancel-button.deny.negative.ember-view.flexberry-button.ui.button');

  // approveButton.
  assert.strictEqual($approveButton.length === 1, true, 'Component has inner label');
  assert.strictEqual(
    $approveButton.hasClass(flexberryClassNames.approveButton),
    true,
    'Component\'s inner label has \'' + flexberryClassNames.approveButton + '\' css-class');
  assert.strictEqual($approveButton.hasClass('approve'), true, 'Component\'s inner label has \'approve\' css-class');
  assert.strictEqual($approveButton.hasClass('positive'), true, 'Component\'s inner label has \'positive\' css-class');
  assert.strictEqual($approveButton.hasClass('ui'), true, 'Component\'s inner label has \'ui\' css-class');
  assert.strictEqual($approveButton.hasClass('button'), true, 'Component\'s inner label has \'button\' css-class');
  assert.strictEqual($approveButton.hasClass('flexberry-button'), true, 'Component\'s inner label has \'flexberry-button\' css-class');

  assert.strictEqual(
    Ember.$.trim($approveButton.text()).length === 0,
    true,
    'Component\'s inner Header is empty by default');

  let approveButtonCaptionText = 'approveButton caption';
  this.set('approveButtonCaption', approveButtonCaptionText);
  assert.strictEqual(
    Ember.$.trim($approveButton.text()),
    approveButtonCaptionText,
    'Component\'s inner label text changes when component\'s \'caption\' property changes');

  // denyButton.
  assert.strictEqual($denyButton.length === 1, true, 'Component has inner label');
  assert.strictEqual(
    $denyButton.hasClass(flexberryClassNames.cancelButton),
    true,
    'Component\'s inner label has \'' + flexberryClassNames.cancelButton + '\' css-class');
  assert.strictEqual($denyButton.hasClass('deny'), true, 'Component\'s inner label has \'deny\' css-class');
  assert.strictEqual($denyButton.hasClass('negative'), true, 'Component\'s inner label has \'negative\' css-class');
  assert.strictEqual($denyButton.hasClass('ui'), true, 'Component\'s inner label has \'ui\' css-class');
  assert.strictEqual($denyButton.hasClass('button'), true, 'Component\'s inner label has \'button\' css-class');
  assert.strictEqual($denyButton.hasClass('flexberry-button'), true, 'Component\'s inner label has \'flexberry-button\' css-class');

  assert.strictEqual(
    Ember.$.trim($denyButton.text()).length === 0,
    true,
    'Component\'s inner Header is empty by default');

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
    {{flexberry-dialog class=class caption=caption
      approveButtonCaption=approveButtonCaption denyButtonCaption=denyButtonCaption
      approve=(action \"onApprove\")
    }}
    `);

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

test('Active dialog', function(assert) {
  assert.expect(8);

  let promise = new Ember.Test.promise((resolve) => {
    this.set('actions.onShow', e => {
      setTimeout(resolve, 100);
    });
  });

  this.render(hbs`
    {{flexberry-dialog class=class caption=caption visible=visible
      approveButtonCaption=approveButtonCaption denyButtonCaption=denyButtonCaption show=(action \"onShow\")
    }}
    `);
  this.set('visible', true);

  let $component = $('div.ui.dimmer.modals.page').children();
  let flexberryClassNames = FlexberryDialogComponent.flexberryClassNames;

  // Check wrapper <div>.
  assert.strictEqual($component.prop('tagName'), 'DIV', 'Component\'s wrapper is a <div>');
  assert.strictEqual(
    $component.hasClass(flexberryClassNames.wrapper),
    true,
    'Component\'s container has \'' + flexberryClassNames.wrapper + '\' css-class');
  assert.strictEqual($component.hasClass('ui'), true, 'Component\'s has \'ui\' css-class');
  assert.strictEqual($component.hasClass('modal'), true, 'Component\'s has \'modal\' css-class');
  assert.strictEqual($component.hasClass('transition'), true, 'Component\'s has \'transition\' css-class');

  return promise.then(() => {
    assert.strictEqual($component.hasClass('visible'), true, 'Component\'s has \'visible\' css-class');
    assert.strictEqual($component.hasClass('active'), true, 'Component\'s has \'active\' css-class');
    assert.strictEqual($component.attr('style'), 'margin-top: -65.5px; display: block !important;', 'Component\'s has style');
    });

});

test('Close dialog after actions approve', function(assert) {
  assert.expect(2);
  Ember.testing = false;
  
  let latestEventObjects = {
    approveValue: null,
  };

  this.set('actions.onApprove', e => {
    latestEventObjects.approveValue = e;
  });

  this.render(hbs`
    {{flexberry-dialog class=class caption=caption visible=visible
      approveButtonCaption=approveButtonCaption denyButtonCaption=denyButtonCaption
      approve=(action \"onApprove\")
    }}
    `);
  this.set('visible', true);

  let $component = $('div.ui.dimmer.modals.page').children();
  let $dialogAction = $component.children('div.flexberry-dialog-toolbar.actions');
  let $approveButton = $dialogAction.children('label.flexberry-dialog-approve-button.approve.positive.ember-view.flexberry-button.ui.button');

  return new Ember.Test.promise((resolve) => {
    Ember.run(this, () => {
      setTimeout(function() {
        $approveButton.click();
        assert.notStrictEqual(latestEventObjects.approveValue, null, 'Component\'s \'change\' action was invoked after click');
        resolve();
      }, 500);
    });
  })
  .then(function(result){
    return new Ember.Test.promise((resolve) => {
      Ember.run(this, () => {
        setTimeout(function() {
          assert.strictEqual($component.hasClass('hidden'), true, 'Component\'s has \'hidden\' css-class');
          resolve();
        }, 500);
      });
    });
  });
});
