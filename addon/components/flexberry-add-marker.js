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

  shadowWidth: 8,

  actions: {
      applyImageClick() {
        let canvas = document.getElementById('imageCanvas');
        let ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let img = new Image();
        img.src = this.get('imageURL');
        img.onload =  () => {
          ctx.drawImage(
            img,
            (200 / 2 - this.get('imageWidth') / 2),
            (200 / 2 - this.get('imageHeight') / 2),
            this.get('imageWidth'),
            this.get('imageHeight')
          );
        };
      },

      applyShadowClick() {
        let canvas = document.getElementById('shadeCanvas');
        let ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let img = new Image();
        img.src = this.get('shadowURL');
        img.onload =  () => {
          ctx.drawImage(
            img,
            (200 / 2 - this.get('shadowWidth') / 2),
            (200 / 2 - this.get('shadowHeight') / 2),
            this.get('shadowWidth'),
            this.get('shadowHeight')
          );
        };
      }
    }
});
