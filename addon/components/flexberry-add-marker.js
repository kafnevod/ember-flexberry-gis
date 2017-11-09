import Ember from 'ember';
import layout from '../templates/components/flexberry-add-marker';

export default Ember.Component.extend({
  layout,

  dropDownClass: 'fluid',

  placemarkTypes: ['адин', 'два', 'пять'],

  placemarkViews: ['два', 'три'],

  imageURL: undefined,

  shadowURL: undefined,

  imageHeight: 8,

  imageWidth: 8,

  shadowHeight: 8,

  shadowWidth: 8
});
