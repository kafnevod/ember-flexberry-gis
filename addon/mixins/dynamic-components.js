/**
  @module ember-flexberry-gis
*/

import Ember from 'ember';

// Validates every dynamic component properties.
// Not a mixin member, so yuidoc-comments are unnecessary.
let validateDynamicComponentProperties = function(dynamicComponent, dynamicComponentIndex) {
  dynamicComponent = dynamicComponent || {};

  // Property 'to' must be a string.
  let to = Ember.get(dynamicComponent, 'to');
  Ember.assert(
    `Wrong type of dynamicComponents[${dynamicComponentIndex}].to property: ` +
    `actual type is ${Ember.typeOf(to)}, but \`string\` is expected.`,
    Ember.typeOf(to) === 'string');

  // Property 'componentName' must be a string.
  let componentName = Ember.get(dynamicComponent, 'componentName');
  Ember.assert(
    `Wrong type of dynamicComponents[${dynamicComponentIndex}].componentName property: ` +
    `actual type is ${Ember.typeOf(componentName)}, but \`string\` is expected.`,
    Ember.typeOf(componentName) === 'string');

  // Property 'componentProperties' must be an array (if defined).
  let componentProperties = Ember.get(dynamicComponent, 'componentProperties');
  Ember.assert(
      `Wrong type of dynamicComponents[${dynamicComponentIndex}].componentProperties property: ` +
      `actual type is \`${Ember.typeOf(componentProperties)}\`, but \`object\` or \`instance\` is expected.`,
      Ember.isNone(componentProperties) || Ember.typeOf(componentProperties) === 'object' || Ember.typeOf(componentProperties) === 'instance');
};

/**
  Mixin containing logic making available to add some additional child components inside another component dynamically.

  @class DynamicComponentsMixin
  @extends <a href="http://emberjs.com/api/classes/Ember.Mixin.html">Ember.Mixin</a>
*/
export default Ember.Mixin.create({
  /**
    Additional child components from
    {{#crossLink "DynamicComponentsMixin:dynamicComponents:property"}}'dynamicComponents' property{{/crossLink}},
    mapped from array into flat [JSON-object](http://www.json.org/).

    @property _dynamicComponents
    @type Object
    @readOnly
    @private
  */
  _dynamicComponents: Ember.computed(
    'dynamicComponents.[]',
    'dynamicComponents.@each.to',
    'dynamicComponents.@each.componentName',
    function() {
      let dynamicComponents = this.get('dynamicComponents');
      let result = {};

      Ember.assert(
        `Wrong type of \`dynamicComponents\` propery: ` +
        `actual type is ${Ember.typeOf(dynamicComponents)}, but \`array\` is expected.`,
        Ember.isNone(dynamicComponents) || Ember.isArray(dynamicComponents));

      if (!Ember.isArray(dynamicComponents)) {
        return result;
      }

      for (let i = 0, len = dynamicComponents.length; i < len; i++) {
        let dynamicComponent = dynamicComponents[i];
        validateDynamicComponentProperties(dynamicComponent, i);

        let to = Ember.get(dynamicComponent, 'to');
        if (Ember.isNone(result[to])) {
          result[to] = Ember.A();
        }

        result[to].pushObject({
          componentName: Ember.get(dynamicComponent, 'componentName'),
          componentProperties: Ember.get(dynamicComponent, 'componentProperties')
        });
      }

      return result;
    }
  ),

  /**
    Additional child components which will be dynamically added to a defined component's places.

    @property dynamicComponents
    @type DynamicComponentObject[]
    @default null
  */
  dynamicComponents: null
});