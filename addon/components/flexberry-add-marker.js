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

  applyImageReadonly: false,

  applyShadowReadonly: false,

  init() {
    this._super(...arguments);
  },

  shadowSizesDidChange:  Ember.on('init', Ember.observer('shadowHeight', 'shadowWidth', function() {
    if (this.get('shadowHeight') <= 0 || this.get('shadowWidth') <= 0) {
      this.set('applyShadowReadonly', true);
    } else {
      this.set('applyShadowReadonly', false);
    }
  })),

  imageSizesDidChange:  Ember.on('init', Ember.observer('imageHeight', 'imageWidth', function() {
    if (this.get('imageHeight') <= 0 || this.get('imageWidth') <= 0) {
      this.set('applyImageReadonly', true);
    } else {
      this.set('applyImageReadonly', false);
    }
  })),

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
      let canvas = document.getElementById('shadowCanvas');
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
