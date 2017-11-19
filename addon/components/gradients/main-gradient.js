/**
  @module ember-flexberry-gis
*/

import Ember from 'ember';
import layout from '../../templates/components/gradients/main-gradient';

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

  _isMainGradTest: [{ "name":"grad1", "colorS":"#ff0000", "colorE": "#ffff00" },
      { "name":"grad2", "colorS":"#000000", "colorE": "#ffffff" },
      { "name":"grad3", "colorS":"#00ff00", "colorE": "#0000ff" },
      { "name":"grad4", "colorS":"#6464c8", "colorE": "#ff9616" }]
});
