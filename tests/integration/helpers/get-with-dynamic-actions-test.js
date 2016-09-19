import Ember from 'ember';
import DynamicActionHelper from 'ember-flexberry-gis/helpers/get-with-dynamic-actions';
import { module, test } from 'qunit';
let helper;
let application;
let args;
let argsArr;
let testArr;
let hash;

module('Integration | Helper | get-with-dynamic-actions', {
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      application.deferReadiness();
      helper = new DynamicActionHelper();

      // Object hierarchy.
      let testObj = Object({
        treeNodes: Object({
          nodes: Object({
            test: 'test'
          })
        })
      });
      args = [testObj, 'treeNodes'];

      // Array object hierarchy.
      let arrItem1 = Object({
        subObj1: Object({
          nodes: Object({
            test: 'testItem1'
          })
        })
      });
      let arrItem2 = Object({
        subObj1: Object({
          subObj2: Object({
            test: 'testItem2'
          })
        })
      });
      testArr = Ember.A([arrItem1, arrItem2]);
      let testArrObj = Object({
        treeNodes: testArr
      });
      argsArr = [testArrObj, 'treeNodes'];

      // Hash.
      let hashArr1 = Object({
        on: 'headerClick',
        actionName: 'onTreenodeHeaderClick',
        actionArguments: ['{% nodePath %}']
      });
      let hashArr2 = Object({
        on:'checkboxChange',
        actionName:'onTreenodeCheckboxChange',
        actionArguments:['{% nodePath %}.checkboxValue']
      });
      hash = Object({
        dynamicActions: [hashArr1, hashArr2],
        hierarchyPropertyName:'nodes',
        pathKeyword:'nodePath'
      });

    });
  }
});

test('compute works', function(assert) {
  assert.expect(2);
  let returnValue = helper.compute(args,hash);
  assert.strictEqual(returnValue.nodes.dynamicActions[0].actionArguments[0],'treeNodes.nodes');
  assert.strictEqual(returnValue.nodes.dynamicActions[1].actionArguments[0],'treeNodes.nodes.checkboxValue');
});

test('willDestroy works', function(assert) {
  assert.expect(12);
  helper.compute(args,hash);
  let obsArr = helper._hierarchyPropertiesObservers;

  // Helper metod.
  assert.strictEqual(obsArr.length, 3);
  assert.strictEqual(obsArr[0].propertyPath,'treeNodes');
  assert.strictEqual(obsArr[1].propertyPath,'treeNodes.nodes');
  assert.strictEqual(obsArr[2].propertyPath,'treeNodes.nodes.nodes');

  let obsArrInEmber = helper._rootPropertyOwner.__ember_meta__._listeners;
  assert.strictEqual(obsArr[0].referenceObserver,obsArrInEmber[2]);
  assert.strictEqual(obsArr[1].referenceObserver,obsArrInEmber[6]);
  assert.strictEqual(obsArr[2].referenceObserver,obsArrInEmber[10]);

  // Ember metod.
  assert.strictEqual(Ember.hasListeners(helper._rootPropertyOwner,'treeNodes:change'),true);
  assert.strictEqual(Ember.hasListeners(helper._rootPropertyOwner,'treeNodes.nodes:change'),true);
  assert.strictEqual(Ember.hasListeners(helper._rootPropertyOwner,'treeNodes.nodes.nodes:change'),true);

  helper.willDestroy();

  assert.strictEqual(helper._hierarchyPropertiesObservers, null);
  assert.strictEqual(helper._rootPropertyOwner, null);
});

test('compute works with arrey', function(assert) {
  assert.expect(4);
  let returnValue = helper.compute(argsArr,hash);
  assert.strictEqual(returnValue[0].dynamicActions[0].actionArguments[0],'treeNodes.0');
  assert.strictEqual(returnValue[0].dynamicActions[1].actionArguments[0],'treeNodes.0.checkboxValue');
  assert.strictEqual(returnValue[1].dynamicActions[0].actionArguments[0],'treeNodes.1');
  assert.strictEqual(returnValue[1].dynamicActions[1].actionArguments[0],'treeNodes.1.checkboxValue');
});

test('add new object in arrey', function(assert) {
  assert.expect(4);
  let returnValue = helper.compute(argsArr,hash);

  let testItem = Object({
    subObj1: Object({
      subObj2: Object({
        test: 'testItem'
      })
    })
  });

  argsArr[0].treeNodes.pushObject(testItem);
  assert.strictEqual(returnValue[2].dynamicActions[0].actionArguments[0],'treeNodes.2');
  assert.strictEqual(returnValue[2].dynamicActions[1].actionArguments[0],'treeNodes.2.checkboxValue');

  assert.strictEqual(Ember.hasListeners(helper._rootPropertyOwner,'treeNodes.2:change'),true);
  assert.strictEqual(Ember.hasListeners(helper._rootPropertyOwner,'treeNodes.2.nodes:change'),true);
});
