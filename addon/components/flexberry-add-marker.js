import Ember from 'ember';
import layout from '../templates/components/flexberry-add-marker';

export default Ember.Component.extend({
  layout,

  imageURL: undefined,

  imageInputClass: undefined,

  shadowURL: undefined,

  shadowInputClass: undefined,

  imageHeight: 8,

  imageWidth: 8,

  shadowHeight: 8,

  shadowWidth: 8,

  applyImageReadonly: false,

  applyShadowReadonly: false,

  canvasSize: 200,

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

  shadowURLDidChange:  Ember.on('init', Ember.observer('shadowURL', function() {
    this.set('shadowInputClass', undefined);
  })),

  imageURLDidChange:  Ember.on('init', Ember.observer('imageURL', function() {
    this.set('imageInputClass', undefined);
  })),
  _redrawResult() {
    let canvasSize = this.get('canvasSize');

    let resultCanvas = document.getElementById('resultCanvas');
    let resultCtx = resultCanvas.getContext('2d');
    resultCtx.clearRect(0, 0, resultCanvas.width, resultCanvas.height);

    if (!Ember.isNone(this.get('imageURL'))) {
      let resultImg = new Image();
      resultImg.src = this.get('imageURL');
      resultImg.onload =  () => {
        resultCtx.drawImage(
          resultImg,
          (canvasSize / 2 - this.get('imageWidth') / 2),
          (canvasSize / 2 - this.get('imageHeight') / 2),
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
          (canvasSize / 2 - this.get('shadowWidth') / 2),
          (canvasSize / 2 - this.get('shadowHeight') / 2),
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
      let canvasSize = this.get('canvasSize');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let img = new Image();
      img.src = this.get('imageURL');
      img.onload =  () => {

        if (img.width > canvasSize || img.height > canvasSize) {
          this.set('imageInputClass', 'input error');
          return;
        }

        let newWidth;
        let newHeight;
        if (img.width > img.height) {
          newWidth = canvasSize;
          newHeight = canvasSize * img.height / img.width;
        } else {
          newHeight = canvasSize;
          newWidth = canvasSize * img.width / img.height;
        }

        let startX = (canvasSize / 2 - newWidth / 2);
        let startY = (canvasSize / 2 - newHeight / 2);

        ctx.drawImage(
          img,
          startX,
          startY,
          newWidth,
          newHeight
        );

        ctx.strokeStyle = '#000000';
        let i = startX;
        let step = Math.round(newWidth / img.width);

        ctx.moveTo(startX, startY);

        while (i + step <= newWidth + startX) {
          console.log('i:' + i);
          ctx.moveTo(i, startY);
          ctx.lineTo(i, newHeight + startY);
          i += step;
        }

        i = startY;
        console.log('горизонтали пошли');
        while (i + step <= newHeight + startY) {
          console.log('i:' + i);
          ctx.moveTo(startX, i);
          ctx.lineTo(newWidth + startX, i);
          i += step;
        }

        ctx.stroke();
        this._redrawResult();
      };

    },

    applyShadowClick() {
      let canvas = document.getElementById('shadowCanvas');
      let canvasSize = this.get('canvasSize');
      let ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let img = new Image();
      img.src = this.get('shadowURL');
      img.onload =  () => {

        if (img.width > canvasSize || img.height > canvasSize) {
          this.set('shadInputClass', 'input error');
          return;
        }

        ctx.drawImage(
          img,
          (canvasSize / 2 - this.get('shadowWidth') / 2),
          (canvasSize / 2 - this.get('shadowHeight') / 2),
          this.get('shadowWidth'),
          this.get('shadowHeight')
        );
        this._redrawResult();
      };
    }
  }
});
