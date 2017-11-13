/**
  @module ember-flexberry-gis
*/

import Ember from 'ember';
import layout from '../../templates/components/gradients/gradient-edit';

/**
  Component for gradient editing.

  @class GradientEditComponent
  @extends <a href="http://emberjs.com/api/classes/Ember.Component.html">Ember.Component</a>
*/

export default Ember.Component.extend({
  /**
    Initial gradient color.
    @property _gradientColorStart
    @type string
    @default '#000000'
  */
  _gradientColorStart: '#000000',

  /**
    The final color of the gradient.
    @property _gradientColorEnd
    @type string
    @default '#FFFFFF'
  */
  _gradientColorEnd: '#FFFFFF',

  /**
      Reference to component's template.
  */
  layout,

  /**
    Component's wrapping <div> CSS-classes names.

    Any other CSS-class names can be added through component's 'class' property.
    ```handlebars
    {{feature-result-item class="my-class"}}
    ```

    @property classNames
    @type String[]
    @default ['gradient-edit', 'flexberry-colorpicker']
  */
  classNames: ['gradient-edit', 'flexberry-colorpicker'],

  /**
    Gradient display.
    @method gradientDrawing
  */
  gradientDrawing(){
    let ctx = this.$('.myCanvas')[0].getContext('2d');

    let grd = ctx.createLinearGradient(0, 0, 300, 0);
    grd.addColorStop(0, this.get('_gradientColorStart'));
    grd.addColorStop(1, this.get('_gradientColorEnd'));

    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 300, 150);
  },

  /**
    Observes changes in Observes changes in the choice of gradient colors.
    Initializes area select color in flexberry-colorpicker.

    @method _gradientColorStartChange
    @private
  */
  _gradientColorStartChange: Ember.observer('_gradientColorStart', '_gradientColorEnd', function() {
    this.gradientDrawing();
  }),

  actions: {
    /**
      Handler for font colorpicker's 'change' action.

      @method actions.onGradientColorStartChange
    */
    onGradientColorStartChange(e) {
      this.set('_gradientColorStart', e.newValue);
    },

    /**
      Handler for font colorpicker's 'change' action.

      @method actions.onGradientColorEndChange
    */
    onGradientColorEndChange(e) {
      this.set('_gradientColorEnd', e.newValue);
    }
  }
});
