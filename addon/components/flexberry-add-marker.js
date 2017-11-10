import Ember from 'ember';
import layout from '../templates/components/flexberry-add-marker';

export default Ember.Component.extend({
  layout,

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

  _redrawResult() {
    let resultCanvas = document.getElementById('resultCanvas');
    let resultCtx = resultCanvas.getContext('2d');
    resultCtx.clearRect(0, 0, resultCanvas.width, resultCanvas.height);

    if (!Ember.isNone(this.get('imageURL'))) {
      let resultImg = new Image();
      resultImg.src = this.get('imageURL');
      resultImg.onload =  () => {
        resultCtx.drawImage(
          resultImg,
          (200 / 2 - this.get('imageWidth') / 2),
          (200 / 2 - this.get('imageHeight') / 2),
          this.get('imageWidth'),
          this.get('imageHeight')
        );
      };
    }

    if (!Ember.isNone(this.get('shadowURL'))) {
      let resultImg = new Image();
      resultImg.src = this.get('shadowURL');
      resultImg.onload =  () => {
        resultCtx.drawImage(
          resultImg,
          (200 / 2 - this.get('shadowWidth') / 2),
          (200 / 2 - this.get('shadowHeight') / 2),
          this.get('shadowWidth'),
          this.get('shadowHeight')
        );
      };
    }
  },

  actions: {
    getImageSizeClick() {
      let img = new Image();
      img.src = this.get('imageURL');
      img.onload =  () => {
        this.set('imageHeight', img.height);
        this.set('imageWidth', img.width);
      };
    },

    getShadowSizeClick() {
      let img = new Image();
      img.src = this.get('shadowURL');
      img.onload =  () => {
        this.set('shadowHeight', img.height);
        this.set('shadowWidth', img.width);
      };
    },

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

      this._redrawResult();
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

      this._redrawResult();
    }
  }
});
