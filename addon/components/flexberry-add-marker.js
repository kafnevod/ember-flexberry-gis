import Ember from 'ember';
import layout from '../templates/components/flexberry-add-marker';

export default Ember.Component.extend({
  layout,

  dropDownClass: 'fluid',

  signTypes: ['адин', 'два', 'пять'],

  signViews: ['два', 'три']
});
