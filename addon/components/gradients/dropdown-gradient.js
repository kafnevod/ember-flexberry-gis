/**
  @module ember-flexberry-gis
*/

import Ember from 'ember';
import layout from '../../templates/components/gradients/dropdown-gradient';

/**
  Component for gradient editing.

  @class GradientEditComponent
  @extends <a href="http://emberjs.com/api/classes/Ember.Component.html">Ember.Component</a>
*/

export default Ember.Component.extend({
  /**
      Reference to component's template.
  */
  layout,

  _isGradTest: [{ "name":"grad1", "colorS":"#ff0000", "colorE": "#ffff00" },
      { "name":"grad2", "colorS":"#000000", "colorE": "#ffffff" },
      { "name":"grad3", "colorS":"#00ff00", "colorE": "#0000ff" },
      { "name":"grad4", "colorS":"#6464c8", "colorE": "#ff9616" }],

  init() {
    this._super(...arguments);

    let owner = Ember.getOwner(this);
    //this.set('_availableTypes', owner.knownNamesForType('layer'));

    let availableEditModes = Ember.A();
    let editModesNames = owner.knownNamesForType('components/gradients/type-gradient');
    editModesNames.forEach((modeName) => {
      let editModeFactory = owner.knownForType('edit-mode', modeName);
      let isAvailable = editModeFactory.componentCanBeInserted(this);
      if (isAvailable) {
        availableEditModes.pushObject(editModeFactory);
      }
    });
  },

  canGrad(idCan, colorS, colorE) {
    let ctx = this.$('.'+idCan)[0].getContext('2d');

    let grd = ctx.createLinearGradient(0, 0, 24, 0);
    grd.addColorStop(0, colorS);
    grd.addColorStop(1, colorE);

    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 24, 14);
  },

  didInsertElement() {
    let isObject = this.get('_isGradTest');

    for (var i in isObject)
    {
      this.canGrad(isObject[i]['name'], isObject[i]['colorS'], isObject[i]['colorE']);
    }
  },

  getValues(array, search) {
    let values1 = [];

    array.forEach(function(item, values){
      (item.name === search) && values1.push(item.colorS, item.colorE);
    });

    return values1;
  },

  actions: {
    onShowOpen(element, value) {
      let isObject = this.get('_isGradTest');
      let vvv = this.getValues(isObject, value);

      this.canGrad(value, vvv[0], vvv[1]);
    }
  }
});
